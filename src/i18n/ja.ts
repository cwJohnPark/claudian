import { TranslationMap } from './types';

export const ja: TranslationMap = {
	'settings.shellPath.name': 'シェルパス',
	'settings.shellPath.desc': '使用するシェルの絶対パス',
	'settings.fontSize.name': 'フォントサイズ',
	'settings.fontSize.desc': 'ターミナルのフォントサイズ (px)',
	'settings.theme.name': 'ターミナルテーマ',
	'settings.theme.desc': 'ターミナルの配色テーマ',
	'settings.autoLaunch.name': 'Claude 自動起動',
	'settings.autoLaunch.desc': 'ターミナルを開いた時に自動で claude を実行',
	'settings.claudeArgs.name': 'Claude 追加引数',
	'settings.claudeArgs.desc': 'claude 実行時の追加フラグ (例: --allowedTools)',
	'settings.promptLanguage.name': 'プロンプト言語',
	'settings.promptLanguage.desc': 'システムプロンプトの既定言語 (変更するとプロンプトがリセットされます)',
	'settings.systemPrompt.name': 'システムプロンプト',
	'settings.systemPrompt.desc': 'Claude 起動時に挿入される Obsidian 専用システムプロンプト',
	'settings.systemPrompt.placeholder': 'システムプロンプトを入力...',
	'terminal.action.launchClaude': 'Claude 起動',
	'terminal.action.insertFilePath': 'ファイルパスを挿入',
	'terminal.action.restart': 'ターミナルを再起動',
	'terminal.processExited': '[プロセス終了]',
};
