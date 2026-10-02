#!/usr/bin/env bash
#
# dev/screenshots.sh: regenerate img/screenshot.png via vhs.
#
# Runs micro against an isolated config in img/tmp/micro-config, so your own
# settings, plugins and syntax files never leak into the screenshot.
#
# Usage:
#   ./dev/screenshots.sh
#
# Requires: vhs (https://github.com/charmbracelet/vhs), micro and zsh on PATH,
# and the Fira Code font.
# Install: brew install vhs micro zsh && brew install --cask font-fira-code

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

for cmd in vhs micro zsh; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "screenshots: $cmd not found on PATH. Install with: brew install $cmd" >&2
    exit 127
  fi
done

# The tape sets `FontFamily "Fira Code"`; without it vhs silently falls back.
if ! fc-list : family 2>/dev/null | grep -i 'fira code' >/dev/null \
  && ! ls ~/Library/Fonts/FiraCode* /Library/Fonts/FiraCode* >/dev/null 2>&1; then
  echo "screenshots: Fira Code font not found. Install with: brew install --cask font-fira-code" >&2
  exit 1
fi

CONFIG=img/tmp/micro-config
SHOT=img/tmp/screenshot.png

# Start from a clean config every run. vhs can also leave a directory of
# frames at an `Output`/`Screenshot` path, so remove both shapes. The committed
# img/screenshot.png is only replaced once vhs has succeeded.
rm -rf -- "$CONFIG" "$SHOT" img/tmp/screenshot.gif
mkdir -p "$CONFIG/colorschemes"
cp mojokai-tc.micro "$CONFIG/colorschemes/"
cat > "$CONFIG/settings.json" <<'EOF'
{
    "colorscheme": "mojokai-tc",
    "truecolor": "on",
    "hlsearch": true,
    "multiopen": "vsplit",
    "statusformatr": "",
    "savecursor": false,
    "saveundo": false
}
EOF

vhs dev/screenshot.tape
mv -f -- "$SHOT" img/screenshot.png

echo "screenshots: wrote img/screenshot.png (intermediate gif in img/tmp/)"
