import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { venueReducer } from '@/features/venue/venueSlice';
import { addonsReducer } from '@/features/addons/addonsSlice';
import { mealsReducer } from '@/features/meals/mealsSlice';
import { promoReducer } from '@/features/promo/promoSlice';
import { uiReducer } from './uiSlice';

const STORAGE_KEY = 'conference-expense-planner-v1';

// Root reducer
const rootReducer = combineReducers({
  venue: venueReducer,
  addons: addonsReducer,
  meals: mealsReducer,
  promo: promoReducer,
  ui: uiReducer,
});

// Load persisted state
function loadPersistedState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error('Failed to load persisted state:', error);
  }
  return undefined;
}

const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

// Persistence: subscribe to store changes
store.subscribe(() => {
  try {
    const state = store.getState();
    const persistedState = {
      venue: state.venue,
      addons: state.addons,
      meals: state.meals,
      promo: state.promo,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Failed to persist state:', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Clear all persisted data
export function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted state:', error);
  }
}
