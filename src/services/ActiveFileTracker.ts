import { App, TFile } from 'obsidian';
import { writeFileSync } from 'fs';
import { CONTEXT_FILE_PATH } from '../constants';

// 활성 파일 컨텍스트 정보
interface FileContext {
	activePath: string;
	filename: string;
	extension: string;
	updatedAt: string;
}

type ChangeCallback = (path: string, filename: string) => void;

// 에디터 포커스 파일 변경 감지 및 컨텍스트 파일 동기화
export class ActiveFileTracker {
	private readonly contextFilePath: string;
	private onChange: ChangeCallback | null = null;

	constructor(private readonly app: App) {
		this.contextFilePath = CONTEXT_FILE_PATH;
	}

	// 파일 변경 콜백 등록
	setOnChange(callback: ChangeCallback): void {
		this.onChange = callback;
	}

	// 파일 열림 이벤트 처리 (workspace.on('file-open') 에서 호출)
	handleFileOpen(file: TFile | null): void {
		if (!file) {
			return;
		}

		const absolutePath = this.resolveAbsolutePath(file);
		this.writeContextFile(absolutePath, file.name, file.extension);
		this.onChange?.(absolutePath, file.name);
	}

	// Vault 기반 절대 경로 생성
	private resolveAbsolutePath(file: TFile): string {
		const adapter = this.app.vault.adapter as any;
		const basePath = adapter.getBasePath?.() ?? '';
		return `${basePath}/${file.path}`;
	}

	// 컨텍스트 JSON 파일 쓰기
	private writeContextFile(
		absolutePath: string,
		filename: string,
		extension: string
	): void {
		const context: FileContext = {
			activePath: absolutePath,
			filename,
			extension,
			updatedAt: new Date().toISOString(),
		};

		writeFileSync(
			this.contextFilePath,
			JSON.stringify(context, null, 2),
			'utf-8'
		);
	}
}
