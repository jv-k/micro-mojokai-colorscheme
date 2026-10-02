#!/usr/bin/env bash
#
# install.sh: install mojokai-tc.micro into micro's colorschemes directory.
#
# Usage:
#   ./install.sh copy   # copy the file (npm run copy)
#   ./install.sh link   # symlink to this repository (npm run link)
#
# Writes to $MICRO_CONFIG_HOME, or ~/.config/micro when that is not set.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEME="$REPO_ROOT/mojokai-tc.micro"
DEST_DIR="${MICRO_CONFIG_HOME:-$HOME/.config/micro}/colorschemes"
DEST="$DEST_DIR/mojokai-tc.micro"

mkdir -p "$DEST_DIR"

case "${1:-}" in
  copy)
    # Remove first: after `link`, DEST is a symlink to SCHEME and cp refuses
    # to copy a file onto itself.
    rm -f -- "$DEST"
    cp "$SCHEME" "$DEST"
    ;;
  link)
    ln -sf "$SCHEME" "$DEST"
    ;;
  *)
    echo "usage: $0 copy|link" >&2
    exit 64
    ;;
esac

echo "install: ${1} -> $DEST"
