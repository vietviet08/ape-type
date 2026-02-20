const UINT32_MAX = 0x100000000;

function xfnv1a(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return h >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / UINT32_MAX;
  };
}

export function createSeededRng(seed: string | number): () => number {
  const normalized = String(seed);
  const hash = xfnv1a(normalized);
  return mulberry32(hash());
}

export function randomInt(
  rng: () => number,
  min: number,
  maxExclusive: number,
): number {
  return Math.floor(rng() * (maxExclusive - min) + min);
}

export function generateSeed(): string {
  const entropy = Math.floor(Math.random() * 1e9).toString(36);
  return `${Date.now().toString(36)}-${entropy}`;
}

export function pickRandomWords(
  words: readonly string[],
  count: number,
  rng: () => number,
): string[] {
  if (words.length === 0) {
    return [];
  }

  const selected: string[] = [];
  for (let i = 0; i < count; i += 1) {
    selected.push(words[randomInt(rng, 0, words.length)]);
  }

  return selected;
}
