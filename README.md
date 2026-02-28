# ClaudeCode Bridge

> AI-powered terminal bringing Claude Code into your knowledge vault.

ClaudeCode Bridge embeds a fully interactive [Claude Code](https://docs.anthropic.com/en/docs/claude-code) terminal directly inside Obsidian. It injects a vault-aware system prompt so Claude understands wikilinks, tags, frontmatter, and your vault's structure out of the box.

## Features

- **Embedded terminal** — xterm.js-based terminal running inside an Obsidian side panel
- **One-click Claude launch** — Start Claude Code with a single button press or command
- **Vault-aware system prompt** — Automatically injects Obsidian markdown rules (wikilinks, tags, frontmatter, embeds, callouts) so Claude respects your vault conventions
- **File path insertion** — Send the active note's path to the terminal with `Cmd+Shift+L`
- **Selection forwarding** — Send selected text to the terminal with `Cmd+Shift+E`
- **Customizable system prompt** — Edit the injected prompt freely or switch between language presets (Korean / English)
- **i18n settings UI** — Settings panel automatically adapts to your system language (English, Korean, Japanese, Chinese)
- **Dark / Light theme** — Terminal theme follows your preference

## Prerequisites

- [Obsidian](https://obsidian.md) v1.0.0+
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and available in your `PATH`

## Installation

### Manual

1. Download the latest release (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder `<vault>/.obsidian/plugins/claudecode-bridge/`
3. Copy the three files into the folder
4. Restart Obsidian and enable **ClaudeCode Bridge** in Settings > Community plugins

### Build from source

```bash
git clone https://github.com/cwJohnPark/claudian.git
cd claudian
npm install
npm run build
```

Copy `main.js`, `manifest.json`, and `styles.css` into your vault's plugin directory.

## Commands

| Command | Default Hotkey | Description |
|---|---|---|
| **ClaudeCode Bridge: Open terminal** | — | Open the terminal panel |
| **ClaudeCode Bridge: Launch Claude** | — | Start Claude Code in the terminal |
| **ClaudeCode Bridge: Insert active file path** | `Cmd+Shift+L` | Insert current note path into terminal |
| **ClaudeCode Bridge: Send selection to terminal** | `Cmd+Shift+E` | Send selected text to terminal |

## Settings

| Setting | Description |
|---|---|
| Shell path | Absolute path to your shell (default: `/bin/zsh`) |
| Font size | Terminal font size in px |
| Terminal theme | Dark or Light |
| Auto-launch Claude | Automatically run Claude when the terminal opens |
| Claude arguments | Extra CLI flags (e.g. `--permission-mode trust`) |
| Prompt language | Default language for the system prompt (Korean / English) |
| System prompt | Editable vault-specific prompt injected via `--append-system-prompt` |

## How the system prompt works

When you launch Claude through ClaudeCode Bridge, the plugin:

1. Writes the system prompt to a temporary file
2. Passes it to Claude Code via `--append-system-prompt`
3. Claude then understands Obsidian conventions — preserving `[[wikilinks]]`, `#tags`, YAML frontmatter, and your vault's folder structure

You can fully customize the prompt in settings or switch between the Korean and English presets.

## Project Structure

```
src/
  main.ts              # Plugin entry point
  types.ts             # Settings interface
  constants.ts         # Defaults, themes, system prompts
  i18n/                # Internationalization (en, ko, ja, zh)
  settings/
    SettingsTab.ts     # Settings UI
  services/
    ShellSpawner.ts    # PTY process management
    VaultContext.ts     # Vault path and file utilities
  views/
    TerminalView.ts    # Terminal view with xterm.js
```

## License

MIT
