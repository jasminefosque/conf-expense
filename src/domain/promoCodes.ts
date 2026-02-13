import type { PromoCode } from './types';

// Promo code rules as specified in requirements
export const promoCodes: Record<string, PromoCode> = {
  EARLYBIRD10: {
    code: 'EARLYBIRD10',
    type: 'venue',
    discountPercent: 10,
  },
  AVBUNDLE5: {
    code: 'AVBUNDLE5',
    type: 'addons',
    discountPercent: 5,
    condition: (subtotal) => subtotal >= 500,
  },
  CATER15: {
    code: 'CATER15',
    type: 'meals',
    discountPercent: 15,
    condition: (_subtotal, metadata) => {
      const people = metadata?.people ?? 0;
      return people >= 50;
    },
  },
};

export function validatePromoCode(code: string): {
  valid: boolean;
  error?: string;
  promo?: PromoCode;
} {
  const upperCode = code.trim().toUpperCase();

  if (!upperCode) {
    return { valid: false, error: 'Please enter a promo code' };
  }

  const promo = promoCodes[upperCode];

  if (!promo) {
    return { valid: false, error: 'Invalid promo code' };
  }

  return { valid: true, promo };
}

export function canApplyPromo(
  promo: PromoCode,
  subtotal: number,
  metadata?: Record<string, number>
): { canApply: boolean; reason?: string } {
  if (subtotal === 0) {
    return {
      canApply: false,
      reason: `No ${promo.type} items selected`,
    };
  }

  if (promo.condition && !promo.condition(subtotal, metadata)) {
    if (promo.code === 'AVBUNDLE5') {
      return {
        canApply: false,
        reason: 'Add-ons subtotal must be at least $500',
      };
    }
    if (promo.code === 'CATER15') {
      return {
        canApply: false,
        reason: 'Number of people must be at least 50',
      };
    }
    return {
      canApply: false,
      reason: 'Promo code conditions not met',
    };
  }

  return { canApply: true };
}
