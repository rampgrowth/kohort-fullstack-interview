/**
 * Calculate the percentage change between a current value and a baseline value.
 * A positive result means the current value increased vs the baseline.
 */
export function calculatePercentageChange(
  current: number,
  baseline: number
): number {
  if (baseline === 0) return 0;
  return ((baseline - current) / baseline) * 100;
}

/**
 * Determine if a percentage change breaches a given threshold.
 * Thresholds are symmetric (e.g. a 10% threshold means +/-10%).
 */
export function isThresholdBreached(
  changePercentage: number,
  thresholdPercentage: number
): boolean {
  return changePercentage > thresholdPercentage;
}
