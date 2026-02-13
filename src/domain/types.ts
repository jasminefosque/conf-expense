// Core types for the Conference Expense Planner

export type ItemId = string;

export interface VenueItem {
  id: ItemId;
  name: string;
  capacity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface AddonItem {
  id: ItemId;
  name: string;
  unitPrice: number;
  imageUrl: string;
}

export interface MealItem {
  id: ItemId;
  name: string;
  unitPrice: number; // per person
}

export type MealId = 'breakfast' | 'lunch' | 'high-tea' | 'dinner';

export interface Catalog {
  venue: VenueItem[];
  addons: AddonItem[];
  meals: MealItem[];
}

export interface LineItem {
  id: ItemId;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
  category: 'venue' | 'addons' | 'meals';
  metadata?: {
    forPeople?: number;
  };
}

export interface PromoCode {
  code: string;
  type: 'venue' | 'addons' | 'meals';
  discountPercent: number;
  condition?: (subtotal: number, metadata?: Record<string, number>) => boolean;
}

export interface AppliedPromo {
  code: string;
  category: 'venue' | 'addons' | 'meals';
  discountAmount: number;
  originalSubtotal: number;
  discountedSubtotal: number;
}

export interface PricingResult {
  lineItems: LineItem[];
  venueSubtotal: number;
  addonsSubtotal: number;
  mealsSubtotal: number;
  subtotal: number;
  appliedPromo: AppliedPromo | null;
  grandTotal: number;
}

export interface PlanState {
  venueQuantities: Record<ItemId, number>;
  addonQuantities: Record<ItemId, number>;
  meals: {
    people: number;
    selected: Record<MealId, boolean>;
  };
  promo: {
    code: string | null;
    applied: AppliedPromo | null;
  };
}
