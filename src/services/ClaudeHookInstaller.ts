import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { CONTEXT_FILE_PATH } from '../constants';

// Claude Code settings.json 내 hook 구조
interface HookEntry {
	type: string;
	command: string;
}

interface HookMatcher {
	matcher: string;
	hooks: HookEntry[];
}

interface ClaudeSettings {
	hooks?: Record<string, HookMatcher[]>;
	[key: string]: unknown;
}

// vault의 .claude/settings.json에 UserPromptSubmit hook을 등록
export class ClaudeHookInstaller {
	private static readonly HOOK_COMMAND = `cat ${CONTEXT_FILE_PATH}`;

	// hook 설치 (플러그인 onload 시 1회 호출)
	static install(vaultBasePath: string): void {
		const settingsPath = join(vaultBasePath, '.claude', 'settings.json');
		const settings = this.readOrCreateSettings(settingsPath);

		if (this.hasClaudianHook(settings)) {
			return;
		}

		this.addHook(settings);
		this.writeSettings(settingsPath, settings);
	}

	// settings.json 읽기 (없으면 빈 객체 반환)
	private static readOrCreateSettings(
		settingsPath: string
	): ClaudeSettings {
		if (!existsSync(settingsPath)) {
			return {};
		}

		const raw = readFileSync(settingsPath, 'utf-8');
		return JSON.parse(raw) as ClaudeSettings;
	}

	// claudian hook이 이미 등록되어 있는지 확인
	private static hasClaudianHook(settings: ClaudeSettings): boolean {
		const matchers = settings.hooks?.UserPromptSubmit;
		if (!matchers) {
			return false;
		}

		return matchers.some((matcher) =>
			matcher.hooks.some((hook) => hook.command === this.HOOK_COMMAND)
		);
	}

	// UserPromptSubmit hook 추가
	private static addHook(settings: ClaudeSettings): void {
		if (!settings.hooks) {
			settings.hooks = {};
		}

		if (!settings.hooks.UserPromptSubmit) {
			settings.hooks.UserPromptSubmit = [];
		}

		const hookMatcher: HookMatcher = {
			matcher: '',
			hooks: [
				{
					type: 'command',
					command: this.HOOK_COMMAND,
				},
			],
		};

		settings.hooks.UserPromptSubmit.push(hookMatcher);
	}

	// settings.json 쓰기 (디렉토리 없으면 생성)
	private static writeSettings(
		settingsPath: string,
		settings: ClaudeSettings
	): void {
		const directory = dirname(settingsPath);
		if (!existsSync(directory)) {
			mkdirSync(directory, { recursive: true });
		}

		writeFileSync(
			settingsPath,
			JSON.stringify(settings, null, 2),
			'utf-8'
		);
	}
}
