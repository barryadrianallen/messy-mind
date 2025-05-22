import { describe, it, expect } from 'vitest';
import { getTaskIcon, calculateCompletionPercentage } from '../../utils/taskUtils';

describe('taskUtils', () => {
  describe('getTaskIcon', () => {
    it('returns correct icon for known task types', () => {
      expect(getTaskIcon('brush')).toBe('🪥');
      expect(getTaskIcon('bed')).toBe('🛏️');
      expect(getTaskIcon('clothes')).toBe('👕');
      expect(getTaskIcon('food')).toBe('🥣');
    });

    it('returns default icon for unknown task types', () => {
      expect(getTaskIcon('unknown')).toBe('📝');
      expect(getTaskIcon('')).toBe('📝');
      expect(getTaskIcon(undefined)).toBe('📝');
    });
  });

  describe('calculateCompletionPercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculateCompletionPercentage(2, 4)).toBe(50);
      expect(calculateCompletionPercentage(1, 4)).toBe(25);
      expect(calculateCompletionPercentage(4, 4)).toBe(100);
    });

    it('handles edge cases', () => {
      expect(calculateCompletionPercentage(0, 5)).toBe(0);
      expect(calculateCompletionPercentage(0, 0)).toBe(0);
    });
  });
});
