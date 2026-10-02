# vhs tape: renders micro with the Mojokai colorscheme as a single PNG.
# Run with: ./dev/screenshots.sh   (or: npm run screenshots)
#
# vhs writes an animated GIF for every tape. We only want the PNG from the
# `Screenshot` directive, so the GIF goes to img/tmp/ (gitignored). The PNG
# also lands in img/tmp/; dev/screenshots.sh moves it to img/screenshot.png
# only after vhs succeeds.
# dev/screenshots.sh prepares the isolated micro config in img/tmp/micro-config
# before this tape runs.

Output img/tmp/screenshot.gif

Set Shell "zsh"
Set FontFamily "Fira Code"
# Rendered at 2x: vhs has no pixel-density setting, and at 1x the thin glyph
# strokes blend into the background so text never reaches its real colour.
# GitHub scales the PNG down to fit, which keeps it Retina-sharp.
Set FontSize 32
Set Width 2800
Set Height 1580
# Terminal palette matches the theme background, so the frame and micro agree.
# background, foreground and selection are copied from mojokai-tc.micro (vhs
# has no variables); update them here when those groups change.
Set Theme { "background": "#1c1c1c", "foreground": "#f8f8f2", "cursor": "#f8f8f2", "black": "#1c1c1c", "red": "#f92672", "green": "#a6e22e", "yellow": "#e6db74", "blue": "#66d9ef", "magenta": "#ae81ff", "cyan": "#66d9ef", "white": "#f8f8f2", "brightBlack": "#6e7066", "brightRed": "#f92672", "brightGreen": "#a6e22e", "brightYellow": "#e6db74", "brightBlue": "#66d9ef", "brightMagenta": "#ae81ff", "brightCyan": "#66d9ef", "brightWhite": "#f8f8f2", "selection": "#3f3452" }
Set Padding 0
Set Margin 16
Set MarginFill ""
Set BorderRadius 20
Set WindowBar Colorful
Set WindowBarSize 80
Set TypingSpeed 10ms

Hide
Type "micro -config-dir img/tmp/micro-config dev/sample/npm.ts dev/sample/width.ts" Enter
Sleep 1.5s
# Search, so hlsearch shows every match in the active pane. "string" occurs in
# both samples, so it matches whichever pane micro leaves active.
Ctrl+F
Type "string"
Enter
Sleep 800ms
Show
Sleep 500ms

Screenshot img/tmp/screenshot.png
