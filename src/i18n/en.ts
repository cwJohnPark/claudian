import { TranslationMap } from './types';

export const en: TranslationMap = {
	'settings.shellPath.name': 'Shell path',
	'settings.shellPath.desc': 'Absolute path to the shell',
	'settings.fontSize.name': 'Font size',
	'settings.fontSize.desc': 'Terminal font size (px)',
	'settings.theme.name': 'Terminal theme',
	'settings.theme.desc': 'Terminal color theme',
	'settings.autoLaunch.name': 'Auto-launch Claude',
	'settings.autoLaunch.desc': 'Automatically run claude when terminal opens',
	'settings.claudeArgs.name': 'Claude arguments',
	'settings.claudeArgs.desc': 'Extra flags for claude (e.g. --allowedTools)',
	'settings.promptLanguage.name': 'Prompt language',
	'settings.promptLanguage.desc': 'Default language for system prompt (changing resets the prompt)',
	'settings.systemPrompt.name': 'System prompt',
	'settings.systemPrompt.desc': 'Obsidian-specific system prompt injected when launching Claude',
	'settings.systemPrompt.placeholder': 'Enter system prompt...',
	'terminal.action.launchClaude': 'Launch Claude',
	'terminal.action.insertFilePath': 'Insert file path',
	'terminal.action.restart': 'Restart terminal',
	'terminal.processExited': '[Process exited]',
};
