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
# Requires: vhs (https://github.com/charmbracelet/vhs) and micro on PATH.
# Install: brew install vhs micro

set -eo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

for cmd in vhs micro; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "screenshots: $cmd not found on PATH. Install with: brew install $cmd" >&2
    exit 127
  fi
done

CONFIG=img/tmp/micro-config

# Start from a clean config every run. vhs can also leave a directory of
# frames at an `Output`/`Screenshot` path, so remove both shapes.
rm -rf -- "$CONFIG" img/screenshot.png img/tmp/screenshot.gif
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

echo "screenshots: wrote img/screenshot.png (intermediate gif in img/tmp/)"
