/**
 * Visual cell width, ANSI-aware. One definition, shared by the layout/help
 * code (re-exported from ui/log) and the status bar. These used to carry two
 * different ANSI regexes that disagreed on what to strip: ui/log matched only
 * SGR colour sequences, the status bar matched every CSI sequence. Measuring a
 * styled string now strips the same set in both places.
 *
 * @module
 */

import { wrapAnsi } from 'fast-wrap-ansi';

// Strip every CSI escape sequence — colour AND cursor movement — so a measured
// string counts only the cells it actually occupies.
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI on purpose
const ANSI_CSI = /\x1b\[[0-9;?]*[A-Za-z]/g;

/** Text without escape sequences, so width is measured on what is actually visible. */
export function stripAnsi(s: string): string {
  return s.replace(ANSI_CSI, '');
}

// Rough fullwidth ranges: CJK symbols/punct, CJK unified, fullwidth forms.
// Not a full Unicode width table, just enough for the characters this project
// renders (logos, CJK package names).
function isFullwidth(cp: number): boolean {
  return (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0x303f) ||
    (cp >= 0x3041 && cp <= 0x33ff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0xa000 && cp <= 0xa4cf) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe30 && cp <= 0xfe4f) ||
    (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6)
  );
}

/**
 * Visual cell width of a string after stripping ANSI, counting fullwidth
 * codepoints as 2 cells so logos and boxes align. Not a full Unicode width
 * implementation, just enough for the characters this project uses.
 */
export function visualWidth(s: string): number {
  let w = 0;
  for (const ch of stripAnsi(s)) {
    w += isFullwidth(ch.codePointAt(0) ?? 0) ? 2 : 1;
  }
  return w;
}

/**
 * Truncate `s` so its visual width is at most `maxCells`, appending `…` (one
 * cell) when it had to cut. Fullwidth codepoints count as 2 cells, like
 * visualWidth, so the result never renders wider than `maxCells` columns.
 * String.slice truncates by UTF-16 code units and would overshoot on fullwidth
 * text, leaving the line wider than intended. Assumes plain text; callers strip
 * ANSI first.
 */
export function clipToWidth(s: string, maxCells: number): string {
  if (visualWidth(s) <= maxCells) return s;
  if (maxCells <= 1) return '…';
  const budget = maxCells - 1; // reserve one cell for the ellipsis
  let width = 0;
  let out = '';
  for (const ch of s) {
    const w = isFullwidth(ch.codePointAt(0) ?? 0) ? 2 : 1;
    if (width + w > budget) break;
    out += ch;
    width += w;
  }
  return `${out}…`;
}

/**
 * ANSI-aware clipToWidth: escape sequences pass through at zero cost, so a
 * styled string clips at the same cell as its plain twin. A cut can land
 * mid-span (after an SGR open, before its reset), so when the input carried
 * ANSI the ellipsis is followed by a full reset to stop the open style
 * bleeding into whatever renders next.
 */
export function clipAnsiToWidth(s: string, maxCells: number): string {
  if (visualWidth(s) <= maxCells) return s;
  const budget = Math.max(0, maxCells - 1); // reserve one cell for the ellipsis
  let width = 0;
  let out = '';
  let sawAnsi = false;
  let i = 0;
  while (i < s.length) {
    if (s[i] === '\x1b' && s[i + 1] === '[') {
      let j = i + 2;
      while (j < s.length && !/[A-Za-z]/.test(s[j] as string)) j++;
      out += s.slice(i, j + 1);
      sawAnsi = true;
      i = j + 1;
      continue;
    }
    const cp = s.codePointAt(i) ?? 0;
    const ch = String.fromCodePoint(cp);
    const w = isFullwidth(cp) ? 2 : 1;
    if (width + w > budget) break;
    out += ch;
    width += w;
    i += ch.length;
  }
  return `${out}…${sawAnsi ? '\x1b[0m' : ''}`;
}

// Any SGR opens a string starts with, then the plain spaces after them.
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching ANSI on purpose
const LEADING_SPACES = /^((?:\x1b\[[0-9;]*m)*)( *)/;

/**
 * Split `s` into the SGR opens it starts with, the plain spaces after them,
 * and the rest, so a caller can measure or move a body's leading spaces
 * without disturbing the span that colours them.
 */
export function splitLeadingSpaces(s: string): { opens: string; lead: string; rest: string } {
  const [, opens = '', lead = ''] = LEADING_SPACES.exec(s) ?? [];
  return { opens, lead, rest: s.slice(opens.length + lead.length) };
}

/**
 * Wrap `text` into rows of at most `maxCells`, ANSI-aware: escape sequences
 * cost nothing, an SGR span open at a row end is closed there and reopened on
 * the next row, and fullwidth codepoints count two cells. Breaks fall at
 * spaces; `hard` also splits a single word wider than `maxCells` by cells.
 * A break that lands on a space consumes it, so no continuation row opens
 * one cell off its column, and a row that was only that space (between two
 * words that each overflow the width) goes with it. Every other character
 * survives, leading spaces and internal runs included, so the rows joined
 * without a separator are `text` less those breaks. Embedded newlines are
 * paragraph breaks and each paragraph wraps on its own. The plain-text
 * sibling is `log.wrapText`, which measures by `length` and is only safe on
 * text with no escapes (ADR 0060).
 */
export function wrapAnsiToWidth(
  text: string,
  maxCells: number,
  opts: { hard?: boolean } = {},
): string[] {
  const options = { hard: opts.hard ?? false, trim: false, wordWrap: true };
  return text.split('\n').flatMap((paragraph) => {
    const [first = '', ...rest] = wrapAnsi(paragraph, maxCells, options).split('\n');
    return [first, ...rest.map(consumeSeparator).filter((row) => stripAnsi(row) !== '')];
  });
}

// The one separator space a break can land on, at the start of a
// continuation row, past the span the wrapper reopened there. When the row
// before was already full and the next word overflows too, the separator is
// the whole row, so consuming it leaves the empty row the filter above drops.
function consumeSeparator(row: string): string {
  const { opens, lead, rest } = splitLeadingSpaces(row);
  return lead ? `${opens}${lead.slice(1)}${rest}` : row;
}
