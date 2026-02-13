import { describe, it, expect } from 'vitest';
import {
  calculatePricing,
  calculatePromoDiscount,
  getTotalItemCount,
} from '../domain/pricingEngine';
import { promoCodes } from '../domain/promoCodes';
import type { PlanState } from '../domain/types';

describe('Pricing Engine', () => {
  const emptyState: PlanState = {
    venueQuantities: {},
    addonQuantities: {},
    meals: {
      people: 0,
      selected: {
        breakfast: false,
        lunch: false,
        'high-tea': false,
        dinner: false,
      },
    },
    promo: {
      code: null,
      applied: null,
    },
  };

  describe('calculatePricing', () => {
    it('should return zero totals for empty state', () => {
      const result = calculatePricing(emptyState);

      expect(result.venueSubtotal).toBe(0);
      expect(result.addonsSubtotal).toBe(0);
      expect(result.mealsSubtotal).toBe(0);
      expect(result.subtotal).toBe(0);
      expect(result.grandTotal).toBe(0);
      expect(result.lineItems).toHaveLength(0);
    });

    it('should calculate venue totals correctly', () => {
      const state: PlanState = {
        ...emptyState,
        venueQuantities: {
          'auditorium-hall': 2, // 2 * 5500 = 11000
          'conference-room': 1, // 1 * 3500 = 3500
        },
      };

      const result = calculatePricing(state);

      expect(result.venueSubtotal).toBe(14500);
      expect(result.subtotal).toBe(14500);
      expect(result.grandTotal).toBe(14500);
      expect(result.lineItems).toHaveLength(2);
      expect(result.lineItems[0].total).toBe(11000);
      expect(result.lineItems[1].total).toBe(3500);
    });

    it('should calculate addons totals correctly', () => {
      const state: PlanState = {
        ...emptyState,
        addonQuantities: {
          speakers: 5, // 5 * 35 = 175
          projectors: 2, // 2 * 200 = 400
        },
      };

      const result = calculatePricing(state);

      expect(result.addonsSubtotal).toBe(575);
      expect(result.subtotal).toBe(575);
      expect(result.grandTotal).toBe(575);
      expect(result.lineItems).toHaveLength(2);
    });

    it('should calculate meals totals correctly', () => {
      const state: PlanState = {
        ...emptyState,
        meals: {
          people: 100,
          selected: {
            breakfast: true, // 100 * 50 = 5000
            lunch: true, // 100 * 65 = 6500
            'high-tea': false,
            dinner: false,
          },
        },
      };

      const result = calculatePricing(state);

      expect(result.mealsSubtotal).toBe(11500);
      expect(result.subtotal).toBe(11500);
      expect(result.grandTotal).toBe(11500);
      expect(result.lineItems).toHaveLength(2);
      expect(result.lineItems[0].metadata?.forPeople).toBe(100);
    });

    it('should calculate combined totals correctly', () => {
      const state: PlanState = {
        venueQuantities: {
          'auditorium-hall': 1, // 5500
        },
        addonQuantities: {
          projectors: 3, // 600
        },
        meals: {
          people: 50,
          selected: {
            breakfast: true, // 2500
            lunch: false,
            'high-tea': false,
            dinner: true, // 3500
          },
        },
        promo: {
          code: null,
          applied: null,
        },
      };

      const result = calculatePricing(state);

      expect(result.venueSubtotal).toBe(5500);
      expect(result.addonsSubtotal).toBe(600);
      expect(result.mealsSubtotal).toBe(6000);
      expect(result.subtotal).toBe(12100);
      expect(result.grandTotal).toBe(12100);
      expect(result.lineItems).toHaveLength(4);
    });
  });

  describe('calculatePromoDiscount', () => {
    it('should calculate EARLYBIRD10 discount correctly', () => {
      const state: PlanState = {
        ...emptyState,
        venueQuantities: {
          'auditorium-hall': 2, // 11000
        },
      };

      const promo = promoCodes.EARLYBIRD10;
      const result = calculatePromoDiscount(promo, state);

      expect(result).not.toBeNull();
      expect(result?.discountAmount).toBe(1100); // 10% of 11000
      expect(result?.category).toBe('venue');
    });

    it('should calculate AVBUNDLE5 discount when condition met', () => {
      const state: PlanState = {
        ...emptyState,
        addonQuantities: {
          projectors: 3, // 600
          whiteboards: 2, // 160
          // Total: 760 >= 500
        },
      };

      const promo = promoCodes.AVBUNDLE5;
      const result = calculatePromoDiscount(promo, state);

      expect(result).not.toBeNull();
      expect(result?.discountAmount).toBe(38); // 5% of 760
      expect(result?.category).toBe('addons');
    });

    it('should not apply AVBUNDLE5 when condition not met', () => {
      const state: PlanState = {
        ...emptyState,
        addonQuantities: {
          speakers: 5, // 175 < 500
        },
      };

      const promo = promoCodes.AVBUNDLE5;
      const result = calculatePromoDiscount(promo, state);

      expect(result).toBeNull();
    });

    it('should calculate CATER15 discount when condition met', () => {
      const state: PlanState = {
        ...emptyState,
        meals: {
          people: 100, // >= 50
          selected: {
            breakfast: true, // 5000
            lunch: true, // 6500
            'high-tea': false,
            dinner: false,
          },
        },
      };

      const promo = promoCodes.CATER15;
      const result = calculatePromoDiscount(promo, state);

      expect(result).not.toBeNull();
      expect(result?.discountAmount).toBe(1725); // 15% of 11500
      expect(result?.category).toBe('meals');
    });

    it('should not apply CATER15 when people count too low', () => {
      const state: PlanState = {
        ...emptyState,
        meals: {
          people: 30, // < 50
          selected: {
            breakfast: true,
            lunch: false,
            'high-tea': false,
            dinner: false,
          },
        },
      };

      const promo = promoCodes.CATER15;
      const result = calculatePromoDiscount(promo, state);

      expect(result).toBeNull();
    });
  });

  describe('getTotalItemCount', () => {
    it('should return 0 for empty state', () => {
      const count = getTotalItemCount(emptyState);
      expect(count).toBe(0);
    });

    it('should count venue items', () => {
      const state: PlanState = {
        ...emptyState,
        venueQuantities: {
          'auditorium-hall': 2,
          'conference-room': 3,
        },
      };

      const count = getTotalItemCount(state);
      expect(count).toBe(5);
    });

    it('should count addon items', () => {
      const state: PlanState = {
        ...emptyState,
        addonQuantities: {
          speakers: 4,
          projectors: 1,
        },
      };

      const count = getTotalItemCount(state);
      expect(count).toBe(5);
    });

    it('should count meals as 1 each regardless of people', () => {
      const state: PlanState = {
        ...emptyState,
        meals: {
          people: 100,
          selected: {
            breakfast: true,
            lunch: true,
            'high-tea': false,
            dinner: true,
          },
        },
      };

      const count = getTotalItemCount(state);
      expect(count).toBe(3); // 3 selected meals
    });

    it('should count all items combined', () => {
      const state: PlanState = {
        venueQuantities: {
          'auditorium-hall': 2,
        },
        addonQuantities: {
          speakers: 3,
        },
        meals: {
          people: 50,
          selected: {
            breakfast: true,
            lunch: true,
            'high-tea': false,
            dinner: false,
          },
        },
        promo: {
          code: null,
          applied: null,
        },
      };

      const count = getTotalItemCount(state);
      expect(count).toBe(7); // 2 + 3 + 2
    });
  });
});
