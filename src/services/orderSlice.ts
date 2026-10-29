import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrderByNumberApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  fetchedOrder: TOrder | null;
  fetchedOrderLoading: boolean;
  fetchedOrderError: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  fetchedOrder: null,
  fetchedOrderLoading: false,
  fetchedOrderError: null,
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]): Promise<TOrder> => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number): Promise<TOrder | null> => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.fetchedOrderLoading = true;
        state.fetchedOrder = null;
        state.fetchedOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.fetchedOrderLoading = false;
        state.fetchedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.fetchedOrderLoading = false;
        state.fetchedOrderError = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
