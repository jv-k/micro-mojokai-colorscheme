# vhs tape: renders micro with the Mojokai colorscheme as a single PNG.
# Run with: ./dev/screenshots.sh   (or: npm run screenshots)
#
# vhs writes an animated GIF for every tape. We only want the PNG from the
# `Screenshot` directive, so the GIF goes to img/tmp/ (gitignored).
# dev/screenshots.sh prepares the isolated micro config in img/tmp/micro-config
# before this tape runs.

Output img/tmp/screenshot.gif

Set Shell "zsh"
Set FontFamily "Fira Code"
Set FontSize 16
Set Width 1200
Set Height 790
# Terminal palette matches the theme background, so the frame and micro agree.
Set Theme { "background": "#1c1c1c", "foreground": "#f8f8f2", "cursor": "#f8f8f2", "black": "#1c1c1c", "red": "#f92672", "green": "#a6e22e", "yellow": "#e6db74", "blue": "#66d9ef", "magenta": "#ae81ff", "cyan": "#66d9ef", "white": "#f8f8f2", "brightBlack": "#6e7066", "brightRed": "#f92672", "brightGreen": "#a6e22e", "brightYellow": "#e6db74", "brightBlue": "#66d9ef", "brightMagenta": "#ae81ff", "brightCyan": "#66d9ef", "brightWhite": "#f8f8f2", "selection": "#3f3452" }
Set Padding 0
Set Margin 8
Set MarginFill ""
Set BorderRadius 10
Set WindowBar Colorful
Set WindowBarSize 40
Set TypingSpeed 10ms

Hide
Type "micro -config-dir img/tmp/micro-config dev/sample/palette.js dev/sample/palette.go" Enter
Sleep 1.5s
# Search, so hlsearch shows every match, and leave the cursor on a match.
Ctrl+F
Type "colors"
Enter
Sleep 800ms
Show
Sleep 500ms

Screenshot img/screenshot.png
