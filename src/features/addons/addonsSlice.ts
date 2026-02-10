import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ItemId } from '@/domain/types';

interface AddonsState {
  quantities: Record<ItemId, number>;
}

const initialState: AddonsState = {
  quantities: {},
};

const addonsSlice = createSlice({
  name: 'addons',
  initialState,
  reducers: {
    setQuantity: (state, action: PayloadAction<{ id: ItemId; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.quantities[id];
      } else {
        state.quantities[id] = quantity;
      }
    },
    increment: (state, action: PayloadAction<ItemId>) => {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] ?? 0) + 1;
    },
    decrement: (state, action: PayloadAction<ItemId>) => {
      const id = action.payload;
      const current = state.quantities[id] ?? 0;
      if (current > 0) {
        if (current === 1) {
          delete state.quantities[id];
        } else {
          state.quantities[id] = current - 1;
        }
      }
    },
    reset: (state) => {
      state.quantities = {};
    },
  },
});

export const addonsActions = addonsSlice.actions;
export const addonsReducer = addonsSlice.reducer;
