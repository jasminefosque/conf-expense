import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppliedPromo } from '@/domain/types';

interface PromoState {
  code: string | null;
  applied: AppliedPromo | null;
}

const initialState: PromoState = {
  code: null,
  applied: null,
};

const promoSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {
    setPromoCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    applyPromo: (state, action: PayloadAction<AppliedPromo>) => {
      state.applied = action.payload;
    },
    clearPromo: (state) => {
      state.code = null;
      state.applied = null;
    },
    reset: (state) => {
      state.code = null;
      state.applied = null;
    },
  },
});

export const promoActions = promoSlice.actions;
export const promoReducer = promoSlice.reducer;
