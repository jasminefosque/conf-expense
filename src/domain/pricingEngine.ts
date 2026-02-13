import { catalog } from './catalog';
import { canApplyPromo } from './promoCodes';
import type {
  AppliedPromo,
  LineItem,
  MealId,
  PlanState,
  PricingResult,
  PromoCode,
} from './types';

/**
 * Pure pricing engine that calculates all totals from state
 * This is the single source of truth for all pricing calculations
 */
export function calculatePricing(state: PlanState): PricingResult {
  // Calculate venue line items and subtotal
  const venueLineItems: LineItem[] = [];
  let venueSubtotal = 0;

  for (const item of catalog.venue) {
    const quantity = state.venueQuantities[item.id] ?? 0;
    if (quantity > 0) {
      const total = item.unitPrice * quantity;
      venueLineItems.push({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity,
        total,
        category: 'venue',
      });
      venueSubtotal += total;
    }
  }

  // Calculate addons line items and subtotal
  const addonsLineItems: LineItem[] = [];
  let addonsSubtotal = 0;

  for (const item of catalog.addons) {
    const quantity = state.addonQuantities[item.id] ?? 0;
    if (quantity > 0) {
      const total = item.unitPrice * quantity;
      addonsLineItems.push({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity,
        total,
        category: 'addons',
      });
      addonsSubtotal += total;
    }
  }

  // Calculate meals line items and subtotal
  const mealsLineItems: LineItem[] = [];
  let mealsSubtotal = 0;
  const people = state.meals.people;

  if (people > 0) {
    for (const item of catalog.meals) {
      const mealId = item.id as MealId;
      if (state.meals.selected[mealId]) {
        const total = item.unitPrice * people;
        mealsLineItems.push({
          id: item.id,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: people,
          total,
          category: 'meals',
          metadata: {
            forPeople: people,
          },
        });
        mealsSubtotal += total;
      }
    }
  }

  // Combine all line items
  const lineItems = [...venueLineItems, ...addonsLineItems, ...mealsLineItems];
  const subtotal = venueSubtotal + addonsSubtotal + mealsSubtotal;

  // Apply promo code if present and valid
  let appliedPromo: AppliedPromo | null = null;
  let grandTotal = subtotal;

  if (state.promo.code && state.promo.applied) {
    // Use the already applied promo from state
    appliedPromo = state.promo.applied;
    grandTotal = subtotal - appliedPromo.discountAmount;
  }

  return {
    lineItems,
    venueSubtotal,
    addonsSubtotal,
    mealsSubtotal,
    subtotal,
    appliedPromo,
    grandTotal,
  };
}

/**
 * Calculate what the promo discount would be if applied
 */
export function calculatePromoDiscount(
  promo: PromoCode,
  state: PlanState
): AppliedPromo | null {
  const pricing = calculatePricing({ ...state, promo: { code: null, applied: null } });

  let targetSubtotal = 0;
  const metadata: Record<string, number> = {};

  switch (promo.type) {
    case 'venue':
      targetSubtotal = pricing.venueSubtotal;
      break;
    case 'addons':
      targetSubtotal = pricing.addonsSubtotal;
      break;
    case 'meals':
      targetSubtotal = pricing.mealsSubtotal;
      metadata.people = state.meals.people;
      break;
  }

  const { canApply } = canApplyPromo(promo, targetSubtotal, metadata);

  if (!canApply) {
    return null;
  }

  const discountAmount = Math.round((targetSubtotal * promo.discountPercent) / 100);

  return {
    code: promo.code,
    category: promo.type,
    discountAmount,
    originalSubtotal: targetSubtotal,
    discountedSubtotal: targetSubtotal - discountAmount,
  };
}

/**
 * Get total item count across all categories
 */
export function getTotalItemCount(state: PlanState): number {
  let count = 0;

  // Count venue items
  for (const quantity of Object.values(state.venueQuantities)) {
    count += quantity;
  }

  // Count addon items
  for (const quantity of Object.values(state.addonQuantities)) {
    count += quantity;
  }

  // Count selected meals (each meal counts as 1 regardless of people count)
  for (const selected of Object.values(state.meals.selected)) {
    if (selected) {
      count += 1;
    }
  }

  return count;
}
