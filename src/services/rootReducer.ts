import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './ingredientsSlice';
import feedReducer from './feedSlice';
import constructorReducer from './constructorSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
});
