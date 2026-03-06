import {
  calculatePercentageChange,
  isThresholdBreached,
} from '@/lib/metrics';

describe('calculatePercentageChange', () => {
  test('returns positive change when current exceeds baseline', () => {
    // 110 vs baseline of 100 = +10%
    expect(calculatePercentageChange(110, 100)).toBe(10);
  });

  test('returns negative change when current is below baseline', () => {
    // 90 vs baseline of 100 = -10%
    expect(calculatePercentageChange(90, 100)).toBe(-10);
  });

  test('returns 0 when values are equal', () => {
    expect(calculatePercentageChange(100, 100)).toBe(0);
  });

  test('returns 0 when baseline is 0', () => {
    expect(calculatePercentageChange(50, 0)).toBe(0);
  });
});

describe('isThresholdBreached', () => {
  test('detects breach for positive change exceeding threshold', () => {
    expect(isThresholdBreached(15, 10)).toBe(true);
  });

  test('detects breach for negative change exceeding threshold', () => {
    // -15% change should breach a +/-10% threshold
    expect(isThresholdBreached(-15, 10)).toBe(true);
  });

  test('returns false when change is within threshold', () => {
    expect(isThresholdBreached(5, 10)).toBe(false);
  });

  test('returns false when negative change is within threshold', () => {
    expect(isThresholdBreached(-5, 10)).toBe(false);
  });
});
