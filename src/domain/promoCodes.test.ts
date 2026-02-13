import { describe, it, expect } from 'vitest';
import { validatePromoCode, canApplyPromo, promoCodes } from '../domain/promoCodes';

describe('Promo Codes', () => {
  describe('validatePromoCode', () => {
    it('should validate EARLYBIRD10', () => {
      const result = validatePromoCode('EARLYBIRD10');
      expect(result.valid).toBe(true);
      expect(result.promo?.code).toBe('EARLYBIRD10');
      expect(result.promo?.type).toBe('venue');
      expect(result.promo?.discountPercent).toBe(10);
    });

    it('should validate case-insensitive codes', () => {
      const result = validatePromoCode('earlybird10');
      expect(result.valid).toBe(true);
      expect(result.promo?.code).toBe('EARLYBIRD10');
    });

    it('should handle whitespace', () => {
      const result = validatePromoCode('  AVBUNDLE5  ');
      expect(result.valid).toBe(true);
      expect(result.promo?.code).toBe('AVBUNDLE5');
    });

    it('should reject invalid codes', () => {
      const result = validatePromoCode('INVALID');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid promo code');
    });

    it('should reject empty codes', () => {
      const result = validatePromoCode('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a promo code');
    });
  });

  describe('canApplyPromo', () => {
    describe('EARLYBIRD10 - venue discount', () => {
      const promo = promoCodes.EARLYBIRD10;

      it('should allow application when venue subtotal > 0', () => {
        const result = canApplyPromo(promo, 5000);
        expect(result.canApply).toBe(true);
      });

      it('should not allow application when venue subtotal is 0', () => {
        const result = canApplyPromo(promo, 0);
        expect(result.canApply).toBe(false);
        expect(result.reason).toContain('No venue items selected');
      });
    });

    describe('AVBUNDLE5 - addons discount with condition', () => {
      const promo = promoCodes.AVBUNDLE5;

      it('should allow application when subtotal >= 500', () => {
        const result = canApplyPromo(promo, 500);
        expect(result.canApply).toBe(true);
      });

      it('should allow application when subtotal > 500', () => {
        const result = canApplyPromo(promo, 1000);
        expect(result.canApply).toBe(true);
      });

      it('should not allow application when subtotal < 500', () => {
        const result = canApplyPromo(promo, 499);
        expect(result.canApply).toBe(false);
        expect(result.reason).toContain('at least $500');
      });

      it('should not allow application when subtotal is 0', () => {
        const result = canApplyPromo(promo, 0);
        expect(result.canApply).toBe(false);
      });
    });

    describe('CATER15 - meals discount with people condition', () => {
      const promo = promoCodes.CATER15;

      it('should allow application when people >= 50', () => {
        const result = canApplyPromo(promo, 5000, { people: 50 });
        expect(result.canApply).toBe(true);
      });

      it('should allow application when people > 50', () => {
        const result = canApplyPromo(promo, 10000, { people: 100 });
        expect(result.canApply).toBe(true);
      });

      it('should not allow application when people < 50', () => {
        const result = canApplyPromo(promo, 2500, { people: 30 });
        expect(result.canApply).toBe(false);
        expect(result.reason).toContain('at least 50');
      });

      it('should not allow application when subtotal is 0', () => {
        const result = canApplyPromo(promo, 0, { people: 100 });
        expect(result.canApply).toBe(false);
      });
    });
  });
});
