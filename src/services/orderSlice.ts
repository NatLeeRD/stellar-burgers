import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderPending: (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
      state.error = null;
    },

    createOrderSuccess: (state, action: PayloadAction<TOrder>) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    },

    createOrderFailed: (state, action: PayloadAction<string>) => {
      state.orderRequest = false;
      state.error = action.payload;
    },

    clearOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    },
  },
});

export const { createOrderPending, createOrderSuccess, createOrderFailed, clearOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
