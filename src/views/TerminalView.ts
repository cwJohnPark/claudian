import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { ShellSpawner } from '../services/ShellSpawner';
import { VaultContext } from '../services/VaultContext';
import { PluginSettings } from '../types';
import { TERMINAL_VIEW_TYPE, DARK_THEME, LIGHT_THEME } from '../constants';
import { t } from '../i18n';

export class TerminalView extends ItemView {
	private terminal: Terminal | null = null;
	private fitAddon: FitAddon | null = null;
	private shellSpawner: ShellSpawner;
	private vaultContext: VaultContext;
	private resizeObserver: ResizeObserver | null = null;
	private settings: PluginSettings;
	private activeFileLabel: HTMLSpanElement | null = null;

	constructor(
		leaf: WorkspaceLeaf,
		settings: PluginSettings,
		vaultContext: VaultContext
	) {
		super(leaf);
		this.settings = settings;
		this.vaultContext = vaultContext;
		this.shellSpawner = new ShellSpawner();
	}

	getViewType(): string {
		return TERMINAL_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'ClaudeCode Bridge';
	}

	getIcon(): string {
		return 'terminal';
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass('ccb-container');

		this.mountActionBar(container);
		const terminalHost = container.createDiv({ cls: 'ccb-host' });
		this.mountTerminal(terminalHost);
		this.spawnShellProcess();
		this.observeResize(terminalHost);
	}

	async onClose(): Promise<void> {
		this.resizeObserver?.disconnect();
		this.shellSpawner.kill();
		this.terminal?.dispose();
		this.terminal = null;
		this.fitAddon = null;
	}

	// 설정 변경 시 터미널 업데이트
	updateSettings(settings: PluginSettings): void {
		this.settings = settings;
		if (!this.terminal) {
			return;
		}

		this.terminal.options.fontSize = settings.fontSize;
		this.terminal.options.theme = this.resolveTheme();
		this.fitAddon?.fit();
	}

	// 액션바에 활성 파일명 갱신
	updateActiveFile(path: string, filename: string): void {
		if (!this.activeFileLabel) {
			return;
		}
		this.activeFileLabel.textContent = filename;
		this.activeFileLabel.setAttribute('title', path);
	}

	// 터미널에 텍스트 입력
	writeToTerminal(text: string): void {
		this.shellSpawner.write(text);
	}

	// Claude 실행 명령 전송
	launchClaude(): void {
		const command = this.buildClaudeCommand();
		this.writeToTerminal(command + '\n');
	}

	// 터미널 프로세스 재시작
	restartTerminal(): void {
		this.shellSpawner.kill();
		this.terminal?.clear();
		this.spawnShellProcess();
	}

	// 액션 버튼 바 생성
	private mountActionBar(parent: HTMLElement): void {
		const actionBar = parent.createDiv({ cls: 'ccb-actions' });

		this.createActionButton(actionBar, 'play', t('terminal.action.launchClaude'), () => {
			this.launchClaude();
		});

		this.createActionButton(actionBar, 'file-input', t('terminal.action.insertFilePath'), () => {
			this.insertActiveFilePath();
		});

		this.createActionButton(actionBar, 'rotate-ccw', t('terminal.action.restart'), () => {
			this.restartTerminal();
		});

		this.activeFileLabel = actionBar.createSpan({ cls: 'claudian-active-file' });
		this.activeFileLabel.textContent = t('terminal.activeFile.none');
	}

	private createActionButton(
		parent: HTMLElement,
		icon: string,
		title: string,
		handler: () => void
	): void {
		const button = parent.createEl('button', {
			cls: 'ccb-action-button',
			attr: { 'aria-label': title, title },
		});
		// Obsidian의 아이콘 설정
		const { setIcon } = require('obsidian');
		setIcon(button, icon);
		button.addEventListener('click', handler);
	}

	// xterm.js 터미널 마운트
	private mountTerminal(host: HTMLElement): void {
		this.fitAddon = new FitAddon();

		this.terminal = new Terminal({
			fontSize: this.settings.fontSize,
			fontFamily: 'Menlo, Monaco, "Courier New", monospace',
			theme: this.resolveTheme(),
			cursorBlink: true,
			allowProposedApi: true,
			scrollback: 5000,
		});

		this.terminal.loadAddon(this.fitAddon);
		this.terminal.open(host);

		// Cmd/Ctrl+Shift 조합은 Obsidian 커맨드로 전달 (xterm.js 가로채기 방지)
		this.terminal.attachCustomKeyEventHandler((event) => {
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				return false;
			}
			if (event.metaKey && event.key === 'p') {
				return false;
			}
			return true;
		});

		// 초기 fit은 DOM 렌더링 후 실행
		requestAnimationFrame(() => {
			this.fitAddon?.fit();
		});

		// 터미널 입력을 셸 프로세스로 전달
		this.terminal.onData((data) => {
			this.shellSpawner.write(data);
		});

		// 터미널 크기 변경 시 PTY에 반영
		this.terminal.onResize(({ cols, rows }) => {
			this.shellSpawner.resize(rows, cols);
		});
	}

	// 셸 프로세스 생성 및 stdout 연결
	private spawnShellProcess(): void {
		const cwd = this.vaultContext.getVaultBasePath();
		const proc = this.shellSpawner.spawn(this.settings.shellPath, cwd);

		proc.stdout?.on('data', (data: Buffer) => {
			this.terminal?.write(data.toString());
		});

		proc.stderr?.on('data', (data: Buffer) => {
			this.terminal?.write(data.toString());
		});

		proc.on('exit', () => {
			this.terminal?.write(`\r\n${t('terminal.processExited')}\r\n`);
		});

		// 자동 Claude 실행
		if (this.settings.autoLaunchClaude) {
			setTimeout(() => this.launchClaude(), 500);
		}
	}

	// 리사이즈 감지
	private observeResize(host: HTMLElement): void {
		this.resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				this.fitAddon?.fit();
			});
		});
		this.resizeObserver.observe(host);
	}

	// 현재 활성 파일 경로를 터미널에 삽입
	private insertActiveFilePath(): void {
		const filePath = this.vaultContext.getActiveFilePath();
		if (!filePath) {
			return;
		}
		this.writeToTerminal(`@${filePath}`);
	}

	// 테마 색상 반환
	private resolveTheme() {
		return this.settings.theme === 'dark' ? DARK_THEME : LIGHT_THEME;
	}

	// Claude 명령어 조합 (시스템 프롬프트 포함)
	private buildClaudeCommand(): string {
		const args = this.settings.claudeArgs.trim();
		const prompt = this.settings.systemPrompt.trim();

		let command = 'claude';
		if (args) {
			command += ` ${args}`;
		}
		if (prompt) {
			const promptPath = join(tmpdir(), 'ccb-prompt.txt');
			writeFileSync(promptPath, prompt, 'utf-8');
			command += ` --append-system-prompt "$(cat '${promptPath}')"`;
		}
		return command;
	}
}
