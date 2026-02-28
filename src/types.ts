export interface PluginSettings {
	shellPath: string;
	fontSize: number;
	theme: 'dark' | 'light';
	autoLaunchClaude: boolean;
	claudeArgs: string;
	promptLanguage: 'ko' | 'en';
	systemPrompt: string;
}
