export type SupportedLocale = 'en' | 'ko' | 'ja' | 'zh';

export type TranslationKey =
	| 'settings.shellPath.name'
	| 'settings.shellPath.desc'
	| 'settings.fontSize.name'
	| 'settings.fontSize.desc'
	| 'settings.theme.name'
	| 'settings.theme.desc'
	| 'settings.autoLaunch.name'
	| 'settings.autoLaunch.desc'
	| 'settings.claudeArgs.name'
	| 'settings.claudeArgs.desc'
	| 'settings.promptLanguage.name'
	| 'settings.promptLanguage.desc'
	| 'settings.systemPrompt.name'
	| 'settings.systemPrompt.desc'
	| 'settings.systemPrompt.placeholder'
	| 'terminal.action.launchClaude'
	| 'terminal.action.insertFilePath'
	| 'terminal.action.restart'
	| 'terminal.processExited';

export type TranslationMap = Record<TranslationKey, string>;
