// Mojokai sample: a tiny palette loader
import { readFile } from "node:fs/promises";

const DEFAULT_BG = "#1c1c1c";
const MAX_GROUPS = 64;

/* TODO: support 256-colour fallbacks */
export class Palette {
  constructor(name, colors = {}) {
    this.name = name;
    this.colors = new Map(Object.entries(colors));
    this.truecolor = true;
  }

  get(group) {
    return this.colors.get(group) ?? this.colors.get("default");
  }

  static async load(path) {
    const text = await readFile(path, "utf8");
    const pairs = text
      .split("\n")
      .filter((line) => line.startsWith("color-link"))
      .map((line) => line.match(/^color-link (\S+)\s+"(.+)"$/).slice(1));

    if (pairs.length > MAX_GROUPS || pairs.length === 0) {
      throw new Error(`unexpected group count: ${pairs.length}`);
    }
    return new Palette(path, Object.fromEntries(pairs));
  }
}
