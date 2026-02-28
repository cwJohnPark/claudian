import { PluginSettings } from './types';

export const TERMINAL_VIEW_TYPE = 'claudian-terminal-view';

// 언어별 기본 시스템 프롬프트
export const SYSTEM_PROMPTS: Record<string, string> = {
	ko: `당신은 Obsidian vault 내에서 작업하고 있습니다.
## Obsidian 마크다운 규칙
- 내부 링크: [[노트 이름]] 또는 [[노트 이름|표시 텍스트]]
- 태그: #태그이름 (중첩 가능: #상위/하위)
- YAML frontmatter: 파일 최상단 --- 블록으로 메타데이터 정의
- 임베드: ![[파일명]]으로 다른 노트나 이미지 삽입
- 콜아웃: > [!note] 형식의 강조 블록
## 작업 지침
- vault 내 파일 수정 시 기존 [[wikilinks]]와 태그 구조를 보존하세요
- 새 노트 생성 시 기존 폴더 구조와 네이밍 컨벤션을 따르세요
- frontmatter가 있는 파일은 YAML 블록을 유지하세요
- 한국어로 응답하세요`,

	en: `You are working inside an Obsidian vault.
## Obsidian Markdown Rules
- Internal links: [[Note Name]] or [[Note Name|Display Text]]
- Tags: #tagname (nestable: #parent/child)
- YAML frontmatter: metadata block at top of file between --- markers
- Embeds: ![[filename]] to embed other notes or images
- Callouts: > [!note] style callout blocks
## Guidelines
- Preserve existing [[wikilinks]] and tag structures when editing vault files
- Follow the vault's folder structure and naming conventions when creating notes
- Maintain YAML frontmatter blocks in files that have them
- Respond in English`,
};

export const DEFAULT_SETTINGS: PluginSettings = {
	shellPath: '/bin/zsh',
	fontSize: 14,
	theme: 'dark',
	autoLaunchClaude: false,
	claudeArgs: '',
	promptLanguage: 'ko',
	systemPrompt: SYSTEM_PROMPTS.ko,
};

// 다크 테마 색상
export const DARK_THEME = {
	background: '#1e1e1e',
	foreground: '#d4d4d4',
	cursor: '#d4d4d4',
	selectionBackground: '#264f78',
	black: '#1e1e1e',
	red: '#f44747',
	green: '#6a9955',
	yellow: '#d7ba7d',
	blue: '#569cd6',
	magenta: '#c586c0',
	cyan: '#4ec9b0',
	white: '#d4d4d4',
	brightBlack: '#808080',
	brightRed: '#f44747',
	brightGreen: '#6a9955',
	brightYellow: '#d7ba7d',
	brightBlue: '#569cd6',
	brightMagenta: '#c586c0',
	brightCyan: '#4ec9b0',
	brightWhite: '#ffffff',
};

// 라이트 테마 색상
export const LIGHT_THEME = {
	background: '#ffffff',
	foreground: '#383a42',
	cursor: '#383a42',
	selectionBackground: '#add6ff',
	black: '#383a42',
	red: '#e45649',
	green: '#50a14f',
	yellow: '#c18401',
	blue: '#4078f2',
	magenta: '#a626a4',
	cyan: '#0184bc',
	white: '#fafafa',
	brightBlack: '#a0a1a7',
	brightRed: '#e45649',
	brightGreen: '#50a14f',
	brightYellow: '#c18401',
	brightBlue: '#4078f2',
	brightMagenta: '#a626a4',
	brightCyan: '#0184bc',
	brightWhite: '#ffffff',
};
