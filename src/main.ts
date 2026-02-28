import { Plugin, WorkspaceLeaf } from 'obsidian';
import { TerminalView } from './views/TerminalView';
import { VaultContext } from './services/VaultContext';
import { SettingsTab } from './settings/SettingsTab';
import { PluginSettings } from './types';
import { TERMINAL_VIEW_TYPE, DEFAULT_SETTINGS } from './constants';

export default class ClaudeCodeBridgePlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	private vaultContext: VaultContext | null = null;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.vaultContext = new VaultContext(this.app);

		this.registerTerminalView();
		this.registerCommands();
		this.registerRibbonIcon();
		this.registerSettingsTab();
	}

	async onunload(): Promise<void> {
		this.app.workspace.detachLeavesOfType(TERMINAL_VIEW_TYPE);
	}

	// 터미널 뷰 등록
	private registerTerminalView(): void {
		this.registerView(TERMINAL_VIEW_TYPE, (leaf) => {
			return new TerminalView(leaf, this.settings, this.vaultContext!);
		});
	}

	// 커맨드 팔레트 명령 등록
	private registerCommands(): void {
		this.addCommand({
			id: 'open-terminal',
			name: 'ClaudeCode Bridge: Open terminal',
			callback: () => this.activateTerminalView(),
		});

		this.addCommand({
			id: 'launch-claude',
			name: 'ClaudeCode Bridge: Launch Claude',
			callback: () => this.launchClaudeInTerminal(),
		});

		this.addCommand({
			id: 'insert-file-path',
			name: 'ClaudeCode Bridge: Insert active file path',
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'l' }],
			callback: () => this.insertFilePathToTerminal(),
		});

		this.addCommand({
			id: 'send-selection',
			name: 'ClaudeCode Bridge: Send selection to terminal',
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'e' }],
			editorCallback: () => this.sendSelectionToTerminal(),
		});
	}

	// 리본 아이콘 등록
	private registerRibbonIcon(): void {
		this.addRibbonIcon('terminal', 'ClaudeCode Bridge', () => {
			this.activateTerminalView();
		});
	}

	// 설정 탭 등록
	private registerSettingsTab(): void {
		const settingsTab = new SettingsTab(
			this.app,
			this,
			this.settings,
			(updated) => this.onSettingsChanged(updated)
		);

		this.addSettingTab(settingsTab);
	}

	// 터미널 뷰 활성화 (없으면 생성)
	private async activateTerminalView(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(TERMINAL_VIEW_TYPE);

		if (existing.length > 0) {
			this.app.workspace.revealLeaf(existing[0]);
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

		this.app.workspace.revealLeaf(leaf);
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

	// 현재 파일 경로를 터미널에 삽입
	private insertFilePathToTerminal(): void {
		const view = this.getTerminalView();
		if (!view) {
			return;
		}

		const filePath = this.vaultContext?.getActiveFilePath();
		if (filePath) {
			view.writeToTerminal(`@${filePath}`);
		}
	}

	// 선택된 텍스트를 터미널에 전송
	private sendSelectionToTerminal(): void {
		const view = this.getTerminalView();
		if (!view) {
			return;
		}

		const selection = this.vaultContext?.getSelectedText();
		if (selection) {
			view.writeToTerminal(selection);
		}
	}

	// 설정 로드
	private async loadSettings(): Promise<void> {
		const data = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
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
