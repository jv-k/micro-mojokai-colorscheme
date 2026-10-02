# Contributing

This file is for people who change Mojokai. To install or update it, refer to the [README](README.md).

## Change the theme

1. Install with `npm run link`, so that micro reads the file in this repository.
2. Edit `mojokai-tc.micro`. Each line sets the style of one color group, for example `color-link comment "italic #6e7066,#1c1c1c"`.
3. In micro, press `Ctrl-e` and type `reload` to see the change.
4. Run `npm run screenshots` to make a new screenshot. Refer to [Update the screenshot](#update-the-screenshot).
5. Commit the changes. Use [Conventional Commits](https://www.conventionalcommits.org/), for example `fix(theme): ...` or `feat(theme): ...`. VerBump uses these messages to choose the next version.
6. Make a release. Refer to [Make a release](#make-a-release).

## Update the screenshot

To make a new `img/screenshot.png`, run this command:

```sh
npm run screenshots
```

The command needs [vhs](https://github.com/charmbracelet/vhs), micro, zsh, and the Fira Code font. It starts micro with a clean config in `img/tmp/`, so your own micro settings do not change the result. To change what the screenshot shows, edit `dev/screenshot.tape` and the files in `dev/sample/`.

## Make a release

The release script needs [VerBump](https://github.com/jv-k/VerBump). It is not an npm package, so install it with Homebrew first:

```sh
brew install jv-k/tap/verbump
```

To make a release, run this command:

```sh
npm run bump-release
```

The command uses [VerBump](https://github.com/jv-k/VerBump). VerBump reads the commit messages and suggests the next version. Then it updates `CHANGELOG.md`, makes a tag, pushes to `origin`, and makes a GitHub release.

To see the changes before VerBump makes them, run `npm run bump-release -- --dry-run`.
