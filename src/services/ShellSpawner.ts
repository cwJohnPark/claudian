import { ChildProcess, spawn } from 'child_process';

// 리사이즈 명령 프로토콜: \x00R<rows>,<cols>\x00
const RESIZE_PREFIX = '\x00R';
const RESIZE_SUFFIX = '\x00';

// Python pty 모듈로 진짜 PTY를 할당하는 헬퍼 스크립트
// Electron 환경에서 script 명령어가 동작하지 않는 문제를 우회
const PTY_HELPER_SCRIPT = `
import pty, os, sys, select, signal, struct, fcntl, termios

def resize_pty(master_fd, payload):
    try:
        parts = payload.split(b',')
        rows, cols = int(parts[0]), int(parts[1])
        winsize = struct.pack('HHHH', rows, cols, 0, 0)
        fcntl.ioctl(master_fd, termios.TIOCSWINSZ, winsize)
    except Exception:
        pass

def main():
    shell = sys.argv[1] if len(sys.argv) > 1 else '/bin/zsh'
    master_fd, slave_fd = pty.openpty()
    winsize = struct.pack('HHHH', 24, 80, 0, 0)
    fcntl.ioctl(master_fd, termios.TIOCSWINSZ, winsize)

    pid = os.fork()
    if pid == 0:
        os.close(master_fd)
        os.setsid()
        fcntl.ioctl(slave_fd, termios.TIOCSCTTY, 0)
        os.dup2(slave_fd, 0)
        os.dup2(slave_fd, 1)
        os.dup2(slave_fd, 2)
        if slave_fd > 2:
            os.close(slave_fd)
        env = os.environ.copy()
        env['TERM'] = 'xterm-256color'
        env['COLORTERM'] = 'truecolor'
        os.execvpe(shell, [shell, '-l'], env)

    os.close(slave_fd)

    running = [True]
    def on_child_exit(sig, frame):
        try:
            os.waitpid(pid, os.WNOHANG)
        except Exception:
            pass
        running[0] = False
    signal.signal(signal.SIGCHLD, on_child_exit)

    stdin_fd = sys.stdin.fileno()
    resize_magic = b'\\x00R'
    resize_end = b'\\x00'

    try:
        while running[0]:
            try:
                ready, _, _ = select.select([stdin_fd, master_fd], [], [], 0.5)
            except Exception:
                break

            if stdin_fd in ready:
                try:
                    data = os.read(stdin_fd, 4096)
                except OSError:
                    break
                if not data:
                    break
                while resize_magic in data:
                    idx = data.index(resize_magic)
                    if idx > 0:
                        os.write(master_fd, data[:idx])
                    try:
                        end_idx = data.index(resize_end, idx + 2)
                        resize_pty(master_fd, data[idx + 2:end_idx])
                        data = data[end_idx + 1:]
                    except ValueError:
                        data = data[idx + 2:]
                        break
                if data:
                    os.write(master_fd, data)

            if master_fd in ready:
                try:
                    data = os.read(master_fd, 4096)
                except OSError:
                    break
                if not data:
                    break
                os.write(1, data)
    except Exception:
        pass
    finally:
        os.close(master_fd)
        try:
            os.kill(pid, signal.SIGTERM)
        except Exception:
            pass

main()
`;

// Python PTY 헬퍼를 통한 셸 프로세스 생성 및 관리
export class ShellSpawner {
	private process: ChildProcess | null = null;

	// python3 pty 모듈로 PTY 프로세스 생성
	spawn(shellPath: string, cwd: string): ChildProcess {
		this.kill();

		this.process = spawn('python3', ['-c', PTY_HELPER_SCRIPT, shellPath], {
			cwd,
			env: {
				...process.env,
				TERM: 'xterm-256color',
				COLORTERM: 'truecolor',
			},
		});

		return this.process;
	}

	// 터미널에 데이터 입력
	write(data: string): void {
		if (!this.process?.stdin?.writable) {
			return;
		}
		this.process.stdin.write(data);
	}

	// PTY 윈도우 크기 변경
	resize(rows: number, cols: number): void {
		if (!this.process?.stdin?.writable) {
			return;
		}
		this.process.stdin.write(`${RESIZE_PREFIX}${rows},${cols}${RESIZE_SUFFIX}`);
	}

	// 프로세스 종료
	kill(): void {
		if (!this.process) {
			return;
		}

		this.process.kill('SIGTERM');
		this.process = null;
	}

	isRunning(): boolean {
		return this.process !== null && !this.process.killed;
	}
}
