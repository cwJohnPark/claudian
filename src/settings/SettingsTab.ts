import { App, PluginSettingTab, Setting } from 'obsidian';
import { PluginSettings } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { t } from '../i18n';

// 설정 변경 콜백 타입
type OnSettingsChanged = (settings: PluginSettings) => void;

export class SettingsTab extends PluginSettingTab {
	private settings: PluginSettings;
	private readonly onChanged: OnSettingsChanged;

	constructor(
		app: App,
		plugin: any,
		settings: PluginSettings,
		onChanged: OnSettingsChanged
	) {
		super(app, plugin);
		this.settings = settings;
		this.onChanged = onChanged;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		this.addShellPathSetting(containerEl);
		this.addFontSizeSetting(containerEl);
		this.addThemeSetting(containerEl);
		this.addAutoLaunchSetting(containerEl);
		this.addClaudeArgsSetting(containerEl);
		this.addPromptLanguageSetting(containerEl);
		this.addSystemPromptSetting(containerEl);
	}

	updateSettings(settings: PluginSettings): void {
		this.settings = settings;
	}

	private addShellPathSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.shellPath.name'))
			.setDesc(t('settings.shellPath.desc'))
			.addText((text) =>
				text
					.setPlaceholder('/bin/zsh')
					.setValue(this.settings.shellPath)
					.onChange((value) => {
						this.settings.shellPath = value;
						this.onChanged(this.settings);
					})
			);
	}

	private addFontSizeSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.fontSize.name'))
			.setDesc(t('settings.fontSize.desc'))
			.addSlider((slider) =>
				slider
					.setLimits(10, 24, 1)
					.setValue(this.settings.fontSize)
					.setDynamicTooltip()
					.onChange((value) => {
						this.settings.fontSize = value;
						this.onChanged(this.settings);
					})
			);
	}

	private addThemeSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.theme.name'))
			.setDesc(t('settings.theme.desc'))
			.addDropdown((dropdown) =>
				dropdown
					.addOption('dark', 'Dark')
					.addOption('light', 'Light')
					.setValue(this.settings.theme)
					.onChange((value: string) => {
						this.settings.theme = value as 'dark' | 'light';
						this.onChanged(this.settings);
					})
			);
	}

	private addAutoLaunchSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.autoLaunch.name'))
			.setDesc(t('settings.autoLaunch.desc'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.settings.autoLaunchClaude)
					.onChange((value) => {
						this.settings.autoLaunchClaude = value;
						this.onChanged(this.settings);
					})
			);
	}

	private addClaudeArgsSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.claudeArgs.name'))
			.setDesc(t('settings.claudeArgs.desc'))
			.addText((text) =>
				text
					.setPlaceholder('--permission-mode trust')
					.setValue(this.settings.claudeArgs)
					.onChange((value) => {
						this.settings.claudeArgs = value;
						this.onChanged(this.settings);
					})
			);
	}

	private addPromptLanguageSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.promptLanguage.name'))
			.setDesc(t('settings.promptLanguage.desc'))
			.addDropdown((dropdown) =>
				dropdown
					.addOption('ko', '한국어')
					.addOption('en', 'English')
					.setValue(this.settings.promptLanguage)
					.onChange((value: string) => {
						this.settings.promptLanguage = value as 'ko' | 'en';
						this.settings.systemPrompt = SYSTEM_PROMPTS[value];
						this.onChanged(this.settings);
						this.display();
					})
			);
	}

	private addSystemPromptSetting(container: HTMLElement): void {
		new Setting(container)
			.setName(t('settings.systemPrompt.name'))
			.setDesc(t('settings.systemPrompt.desc'))
			.addTextArea((textArea) => {
				textArea
					.setPlaceholder(t('settings.systemPrompt.placeholder'))
					.setValue(this.settings.systemPrompt)
					.onChange((value) => {
						this.settings.systemPrompt = value;
						this.onChanged(this.settings);
					});
				textArea.inputEl.rows = 12;
				textArea.inputEl.style.width = '100%';
				textArea.inputEl.style.minHeight = '200px';
			});
	}
}
