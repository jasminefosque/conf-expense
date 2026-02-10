import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { calculatePricing, getTotalItemCount } from '@/domain/pricingEngine';
import type { PlanState } from '@/domain/types';

// Basic selectors
export const selectVenueQuantities = (state: RootState) => state.venue.quantities;
export const selectAddonQuantities = (state: RootState) => state.addons.quantities;
export const selectMeals = (state: RootState) => state.meals;
export const selectPromo = (state: RootState) => state.promo;
export const selectUI = (state: RootState) => state.ui;

// Create plan state for pricing engine
export const selectPlanState = createSelector(
  [selectVenueQuantities, selectAddonQuantities, selectMeals, selectPromo],
  (venueQuantities, addonQuantities, meals, promo): PlanState => ({
    venueQuantities,
    addonQuantities,
    meals,
    promo,
  })
);

// Calculated pricing
export const selectPricing = createSelector([selectPlanState], (planState) =>
  calculatePricing(planState)
);

// Total item count
export const selectTotalItemCount = createSelector([selectPlanState], (planState) =>
  getTotalItemCount(planState)
);
