# Mojokai for micro

Mojokai is a truecolor colorscheme for the [micro](https://micro-editor.github.io/) text editor. It uses Monokai colors on a dark `#1c1c1c` background.

## Requirements

- micro 2.0 or later.
- A terminal that can show 24-bit color (truecolor).
- The TypeScript syntax file in `syntax/`. Without this file, some TypeScript colors do not show. Refer to [Companion syntax file](#companion-syntax-file).

## Install

1. Clone the repository and its submodule:

   ```sh
   git clone --recurse-submodules https://github.com/jv-k/micro-mojokai-colorscheme.git
   cd micro-mojokai-colorscheme
   ```

2. Install the colorscheme and the syntax file. Use one of these two commands:

   ```sh
   npm run copy   # copies the files into your micro config
   npm run link   # makes symlinks, so changes in this repository show at once
   ```

   The two commands write to `$MICRO_CONFIG_HOME`. If this variable is not set, they write to `~/.config/micro`.

3. In micro, press `Ctrl-e` and type `set colorscheme mojokai-tc`.

## Turn on truecolor

micro shows the exact colors only when truecolor is on. When truecolor is off, micro changes each color to the nearest color in a 256-color palette.

- In micro 2.0.15 and later, press `Ctrl-e` and type `set truecolor on`.
- In earlier versions, set the variable `MICRO_TRUECOLOR=1` before you start micro.

## Companion syntax file

The TypeScript syntax that comes with micro does not mark brackets, operators, or declaration keywords. The syntax file in `syntax/` marks them. This file comes from [micro-typescript-syntax](https://github.com/jv-k/micro-typescript-syntax), which is a git submodule of this repository.

In TypeScript files, these color groups need the syntax file:

| Color groups | Parts of the code |
| --- | --- |
| `symbol.brackets`, `symbol.braces`, `symbol.operator`, `symbol.punctuation` | Brackets, braces, operators, and punctuation |
| `statement.let`, `statement.var`, `statement.const`, `statement.class`, `statement.function` | Declaration keywords |
| `type.types` | Built-in types, for example `string` and `number` |
| `constant.quotes`, `constant.stringEscaped`, `constant.specialChar`, `constant.tplLiterals.expression` | Quotes, escape characters, and template expressions |
| `identifier.const` | Names of constants |

Without the syntax file, micro uses the color of the parent group. For example, `statement.let` gets the `statement` color.

## Make a release

To make a release, run this command:

```sh
npm run bump-release
```

The command uses [VerBump](https://github.com/jv-k/VerBump). VerBump reads the commit messages and suggests the next version. Then it updates `CHANGELOG.md`, makes a tag, pushes to `origin`, and makes a GitHub release.

To see the changes before VerBump makes them, run `npm run bump-release -- --dry-run`.

## License

[ISC](LICENSE)
