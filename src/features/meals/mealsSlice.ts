import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MealId } from '@/domain/types';

interface MealsState {
  people: number;
  selected: Record<MealId, boolean>;
}

const initialState: MealsState = {
  people: 0,
  selected: {
    breakfast: false,
    lunch: false,
    'high-tea': false,
    dinner: false,
  },
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<number>) => {
      state.people = Math.max(0, action.payload);
    },
    toggleMeal: (state, action: PayloadAction<MealId>) => {
      const mealId = action.payload;
      state.selected[mealId] = !state.selected[mealId];
    },
    setMealSelected: (state, action: PayloadAction<{ id: MealId; selected: boolean }>) => {
      state.selected[action.payload.id] = action.payload.selected;
    },
    reset: (state) => {
      state.people = 0;
      state.selected = {
        breakfast: false,
        lunch: false,
        'high-tea': false,
        dinner: false,
      };
    },
  },
});

export const mealsActions = mealsSlice.actions;
export const mealsReducer = mealsSlice.reducer;
