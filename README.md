# Mojokai for micro

A Monokai-style truecolor colorscheme for the [micro](https://micro-editor.github.io/) editor, on a `#1c1c1c` background.

## Requirements

- micro 2.x with a truecolor terminal. On micro versions that need it, set `MICRO_TRUECOLOR=1`, or the hex colours get approximated to the 256-colour palette.
- The companion TypeScript syntax file for full highlighting (see below).

## Install

```sh
git clone --recurse-submodules https://github.com/jv-k/micro-mojokai-colorscheme.git
cd micro-mojokai-colorscheme
npm run copy   # copies the theme and syntax file into your micro config
# or
npm run link   # symlinks them, so edits here take effect immediately
```

Both scripts install into `$MICRO_CONFIG_HOME` (default `~/.config/micro`). Then pick the scheme in micro with `> set colorscheme mojokai-tc`.

## Companion syntax file

Many groups in this theme only exist in the custom TypeScript syntax at `syntax/` (a submodule of [micro-typescript-syntax](https://github.com/jv-k/micro-typescript-syntax)):

`symbol.brackets` · `symbol.braces` · `symbol.operator` · `symbol.punctuation` · `statement.let` · `statement.var` · `statement.class` · `statement.const` · `statement.function` · `type.types` · `constant.quotes` · `constant.stringEscaped` · `constant.specialChar` · `constant.tplLiterals.expression` · `identifier.const`

Without that syntax file the theme still works, but these groups fall back to their parent colours (`symbol`, `statement`, `constant` and so on).

## License

[ISC](LICENSE)
