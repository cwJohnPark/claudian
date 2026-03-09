import { Plugin } from 'obsidian';
import { TerminalView } from './views/TerminalView';
import { VaultContext } from './services/VaultContext';
import { ActiveFileTracker } from './services/ActiveFileTracker';
import { ClaudeHookInstaller } from './services/ClaudeHookInstaller';
import { SettingsTab } from './settings/SettingsTab';
import { PluginSettings } from './types';
import { TERMINAL_VIEW_TYPE, DEFAULT_SETTINGS } from './constants';

export default class ClaudeCodeBridgePlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	private vaultContext: VaultContext | null = null;
	private activeFileTracker: ActiveFileTracker | null = null;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.vaultContext = new VaultContext(this.app);

		this.installClaudeHook();
		this.registerTerminalView();
		this.registerActiveFileTracker();
		this.registerCommands();
		this.registerRibbonIcon();
		this.registerSettingsTab();
	}

	onunload(): void {
	}

	// Claude Code UserPromptSubmit hook 설치
	private installClaudeHook(): void {
		const adapter = this.app.vault.adapter as { getBasePath?: () => string };
		const basePath = adapter.getBasePath?.();
		if (basePath) {
			ClaudeHookInstaller.install(basePath);
		}
	}

	// 터미널 뷰 등록
	private registerTerminalView(): void {
		this.registerView(TERMINAL_VIEW_TYPE, (leaf) => {
			return new TerminalView(leaf, this.settings, this.vaultContext!);
		});
	}

	// 활성 파일 추적기 등록
	private registerActiveFileTracker(): void {
		this.activeFileTracker = new ActiveFileTracker(this.app);
		this.activeFileTracker.setOnChange((path, filename) => {
			const view = this.getTerminalView();
			view?.updateActiveFile(path, filename);
		});

		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				this.activeFileTracker?.handleFileOpen(file);
			})
		);

		// 플러그인 로드 시 이미 열려있는 파일로 초기화
		const currentFile = this.app.workspace.getActiveFile();
		this.activeFileTracker.handleFileOpen(currentFile);
	}

	// 커맨드 팔레트 명령 등록
	private registerCommands(): void {
		this.addCommand({
			id: 'open-terminal',
			name: 'Open terminal',
			callback: () => { void this.activateTerminalView(); },
		});

		this.addCommand({
			id: 'launch-claude',
			name: 'Launch claude',
			callback: () => { void this.launchClaudeInTerminal(); },
		});

		this.addCommand({
			id: 'send-to-terminal',
			name: 'Send to terminal',
			callback: () => this.sendContextToTerminal(),
		});
	}

	// 리본 아이콘 등록
	private registerRibbonIcon(): void {
		this.addRibbonIcon('square-terminal', 'Launch Claude', () => {
			void this.launchClaudeInTerminal();
		});
	}

	// 설정 탭 등록
	private registerSettingsTab(): void {
		const settingsTab = new SettingsTab(
			this.app,
			this,
			this.settings,
			(updated) => { void this.onSettingsChanged(updated); }
		);

		this.addSettingTab(settingsTab);
	}

	// 터미널 뷰 활성화 (없으면 생성)
	private async activateTerminalView(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(TERMINAL_VIEW_TYPE);

		if (existing.length > 0) {
			await this.app.workspace.revealLeaf(existing[0]);
			return;
		}

		const leaf = this.app.workspace.getRightLeaf(false);
		if (!leaf) {
			return;
		}

		await leaf.setViewState({
			type: TERMINAL_VIEW_TYPE,
			active: true,
		});

		await this.app.workspace.revealLeaf(leaf);
	}

	// 터미널 뷰 인스턴스 가져오기
	private getTerminalView(): TerminalView | null {
		const leaves = this.app.workspace.getLeavesOfType(TERMINAL_VIEW_TYPE);
		if (leaves.length === 0) {
			return null;
		}
		return leaves[0].view as TerminalView;
	}

	// 터미널에서 Claude 실행
	private async launchClaudeInTerminal(): Promise<void> {
		await this.activateTerminalView();
		// 뷰가 열릴 때까지 잠시 대기
		setTimeout(() => {
			const view = this.getTerminalView();
			view?.launchClaude();
		}, 300);
	}

	// 파일 참조 문자열을 터미널에 전송 (@파일경로#L시작-종료)
	private sendContextToTerminal(): void {
		const view = this.getTerminalView();
		if (!view) {
			return;
		}

		const filePath = this.vaultContext?.getActiveFilePath();
		if (!filePath) {
			return;
		}

		const lineRange = this.vaultContext?.getSelectionLineRange();
		if (!lineRange) {
			view.writeToTerminal(`@${filePath}`);
			return;
		}

		const lineSuffix = lineRange.end
			? `#L${lineRange.start}-${lineRange.end}`
			: `#L${lineRange.start}`;

		view.writeToTerminal(`@${filePath}${lineSuffix}`);
	}

	// 설정 로드
	private async loadSettings(): Promise<void> {
		const data = (await this.loadData()) as Partial<PluginSettings> | undefined;
		this.settings = { ...DEFAULT_SETTINGS, ...data };
	}

	// 설정 변경 처리
	private async onSettingsChanged(updated: PluginSettings): Promise<void> {
		this.settings = updated;
		await this.saveData(updated);

		// 열려 있는 터미널 뷰에 설정 반영
		const view = this.getTerminalView();
		view?.updateSettings(updated);
	}
}
