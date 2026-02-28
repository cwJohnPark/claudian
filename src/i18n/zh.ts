import { TranslationMap } from './types';

export const zh: TranslationMap = {
	'settings.shellPath.name': 'Shell 路径',
	'settings.shellPath.desc': '所用 Shell 的绝对路径',
	'settings.fontSize.name': '字体大小',
	'settings.fontSize.desc': '终端字体大小 (px)',
	'settings.theme.name': '终端主题',
	'settings.theme.desc': '终端配色主题',
	'settings.autoLaunch.name': '自动启动 Claude',
	'settings.autoLaunch.desc': '打开终端时自动运行 claude',
	'settings.claudeArgs.name': 'Claude 额外参数',
	'settings.claudeArgs.desc': '运行 claude 时附加的标志 (例: --allowedTools)',
	'settings.promptLanguage.name': '提示词语言',
	'settings.promptLanguage.desc': '系统提示词的默认语言 (更改后提示词将被重置)',
	'settings.systemPrompt.name': '系统提示词',
	'settings.systemPrompt.desc': '启动 Claude 时注入的 Obsidian 专用系统提示词',
	'settings.systemPrompt.placeholder': '请输入系统提示词...',
	'terminal.action.launchClaude': '启动 Claude',
	'terminal.action.insertFilePath': '插入文件路径',
	'terminal.action.restart': '重启终端',
	'terminal.processExited': '[进程已退出]',
};
