/** Ethiopian Birr formatting — never use "$" in the UI. */

export function formatEtb(amount: number | string, opts?: { digits?: number }): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  const value = Number.isFinite(n) ? n : 0;
  const digits = opts?.digits ?? (Number.isInteger(value) ? 0 : 2);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  return `${formatted} ETB`;
}

export type PriceBounds = { min: number; max: number };

export function getPriceBounds(prices: number[]): PriceBounds {
  if (!prices.length) return { min: 0, max: 0 };
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export type PricePreset = {
  id: string;
  label: string;
  min: number;
  max: number;
};

/** Build catalog-aware price bands (thirds of the live min–max span). */
export function buildPricePresets(bounds: PriceBounds): PricePreset[] {
  const { min, max } = bounds;
  if (max <= min) {
    return [{ id: 'all', label: 'Any price', min, max }];
  }

  const span = max - min;
  const low = Math.round(min + span / 3);
  const mid = Math.round(min + (2 * span) / 3);

  return [
    { id: 'all', label: 'Any price', min, max },
    { id: 'under', label: `Under ${formatEtb(low)}`, min, max: low },
    { id: 'mid', label: `${formatEtb(low)} – ${formatEtb(mid)}`, min: low, max: mid },
    { id: 'over', label: `${formatEtb(mid)}+`, min: mid, max },
  ];
}
