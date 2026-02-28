import { SupportedLocale, TranslationKey, TranslationMap } from './types';
import { en } from './en';
import { ko } from './ko';
import { ja } from './ja';
import { zh } from './zh';

const translations: Record<SupportedLocale, TranslationMap> = {
	en,
	ko,
	ja,
	zh,
};

// 시스템 언어를 감지하여 지원 언어로 매핑
function detectLocale(): SupportedLocale {
	const raw = navigator.language.toLowerCase();
	const prefix = raw.split('-')[0];

	if (prefix in translations) {
		return prefix as SupportedLocale;
	}
	return 'en';
}

let currentLocale: SupportedLocale = detectLocale();

// 번역 키에 해당하는 문자열 반환
export function t(key: TranslationKey): string {
	return translations[currentLocale][key];
}

export function getCurrentLocale(): SupportedLocale {
	return currentLocale;
}

export function setLocale(locale: SupportedLocale): void {
	currentLocale = locale;
}

export type { TranslationKey, SupportedLocale };
