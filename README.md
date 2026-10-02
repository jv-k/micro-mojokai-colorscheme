# Mojokai for micro

Mojokai is a truecolor colorscheme for the [micro](https://micro-editor.github.io/) text editor. It uses Monokai colors on a dark `#1c1c1c` background.

![micro with the Mojokai colorscheme. Two tabs are open. A TypeScript file shows comments, strings, keywords, types, and search matches in yellow.](img/screenshot.png)

## Requirements

- micro 2.0 or later.
- A terminal that can show 24-bit color (truecolor).

## Install

1. Clone the repository:

   ```sh
   git clone https://github.com/jv-k/micro-mojokai-colorscheme.git
   cd micro-mojokai-colorscheme
   ```

2. Install the colorscheme. Use one of these two commands:

   ```sh
   npm run copy   # copies the file into your micro config
   npm run link   # makes a symlink, so changes in this repository show at once
   ```

   The two commands write to `$MICRO_CONFIG_HOME`. If this variable is not set, they write to `~/.config/micro`.

3. In micro, press `Ctrl-e` and type `set colorscheme mojokai-tc`.

## Install with an AI agent

A coding agent, for example Claude Code or Codex, can do the installation for you. Read the prompt below, then copy it and give it to your agent:

```text
Install the Mojokai colorscheme for the micro text editor.

1. Run `micro -version`. If micro is not installed, stop and tell me.
2. Clone the repository into a temporary directory:
   git clone https://github.com/jv-k/micro-mojokai-colorscheme.git
3. Find the micro config directory. Use $MICRO_CONFIG_HOME if it is set. If it is not set, use ~/.config/micro.
4. Copy mojokai-tc.micro into the colorschemes/ directory of the config directory. Make the directory if it does not exist. Copy the file. Do not make a symlink to the temporary directory.
5. If a file with the same name is already there, do not overwrite it. Show me the differences and ask me first.
6. In settings.json in the config directory, set "colorscheme" to "mojokai-tc". Keep all other settings. If the file does not exist, make it.
7. If the micro version is 2.0.15 or later, also set "truecolor" to "on" in settings.json. If the version is earlier, tell me to add `export MICRO_TRUECOLOR=1` to my shell profile. Do not change my shell profile.
8. Delete the temporary directory. Then tell me which files you changed.
```

## Turn on truecolor

micro shows the exact colors only when truecolor is on. When truecolor is off, micro changes each color to the nearest color in a 256-color palette.

- In micro 2.0.15 and later, press `Ctrl-e` and type `set truecolor on`.
- In earlier versions, set the variable `MICRO_TRUECOLOR=1` before you start micro.

## Update

How you update depends on how you installed Mojokai:

- If you used `npm run copy`, go to your clone of this repository. Run `git pull`, then run `npm run copy` again.
- If you used `npm run link`, go to your clone of this repository and run `git pull`. The symlink points to the new file.
- If you used the AI agent prompt, give the prompt to your agent again. The agent shows you the differences and asks before it replaces the old file.

Then, in micro, press `Ctrl-e` and type `reload`. Or close micro and start it again.

## Change the theme

1. Install with `npm run link`, so that micro reads the file in this repository.
2. Edit `mojokai-tc.micro`. Each line sets the style of one color group, for example `color-link comment "italic #6e7066,#1c1c1c"`.
3. In micro, press `Ctrl-e` and type `reload` to see the change.
4. Run `npm run screenshots` to make a new screenshot. Refer to [Update the screenshot](#update-the-screenshot).
5. Commit the changes. Use [Conventional Commits](https://www.conventionalcommits.org/), for example `fix(theme): ...` or `feat(theme): ...`. VerBump uses these messages to choose the next version.
6. Make a release. Refer to [Make a release](#make-a-release).

## Make a release

To make a release, run this command:

```sh
npm run bump-release
```

The command uses [VerBump](https://github.com/jv-k/VerBump). VerBump reads the commit messages and suggests the next version. Then it updates `CHANGELOG.md`, makes a tag, pushes to `origin`, and makes a GitHub release.

To see the changes before VerBump makes them, run `npm run bump-release -- --dry-run`.

## Update the screenshot

To make a new `img/screenshot.png`, run this command:

```sh
npm run screenshots
```

The command needs [vhs](https://github.com/charmbracelet/vhs) and micro. It starts micro with a clean config in `img/tmp/`, so your own micro settings do not change the result. To change what the screenshot shows, edit `dev/screenshot.tape` and the files in `dev/sample/`.

## License

[ISC](LICENSE)
