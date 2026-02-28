import { TranslationMap } from './types';

export const ko: TranslationMap = {
	'settings.shellPath.name': 'Shell 경로',
	'settings.shellPath.desc': '사용할 셸의 절대 경로',
	'settings.fontSize.name': '폰트 크기',
	'settings.fontSize.desc': '터미널 폰트 크기 (px)',
	'settings.theme.name': '터미널 테마',
	'settings.theme.desc': '터미널 색상 테마',
	'settings.autoLaunch.name': '자동 Claude 실행',
	'settings.autoLaunch.desc': '터미널 열 때 자동으로 claude 명령 실행',
	'settings.claudeArgs.name': 'Claude 추가 인자',
	'settings.claudeArgs.desc': 'claude 실행 시 추가할 플래그 (예: --allowedTools)',
	'settings.promptLanguage.name': '프롬프트 언어',
	'settings.promptLanguage.desc': '시스템 프롬프트 기본 언어 선택 (변경 시 프롬프트가 초기화됩니다)',
	'settings.systemPrompt.name': '시스템 프롬프트',
	'settings.systemPrompt.desc': 'Claude 실행 시 주입되는 Obsidian 특화 시스템 프롬프트',
	'settings.systemPrompt.placeholder': '시스템 프롬프트를 입력하세요...',
	'terminal.action.launchClaude': 'Claude 실행',
	'terminal.action.insertFilePath': '파일 경로 삽입',
	'terminal.action.restart': '터미널 재시작',
	'terminal.activeFile.none': '파일 없음',
	'terminal.processExited': '[프로세스 종료됨]',
};
