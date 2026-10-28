import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUserApi, getUserApi, getOrdersApi } from '../utils/burger-api';
import type { TLoginData } from '../utils/burger-api';
import { setCookie } from '../utils/cookie';
import type { TUser, TOrder } from '../utils/types';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  orders: TOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData): Promise<TUser> => {
    const response = await loginUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (): Promise<TUser> => {
    const response = await getUserApi();
    return response.user;
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'user/fetchOrders',
  getOrdersApi
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
      state.orders = [];
      state.ordersLoading = false;
      state.ordersError = null;
    },

    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.orders = [];
        state.ordersLoading = false;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        if (!state.user) {
          return;
        }
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message ?? 'Ошибка загрузки заказов';
      });
  },
});

export const { setUser, clearUser, setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
