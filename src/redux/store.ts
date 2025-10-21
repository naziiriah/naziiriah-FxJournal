import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./resources/auth/authSlice";
import biasReducer from "./resources/bias/biasSlice";
import ruleReducer from "./resources/rule/ruleSlice";
import tradeReducer from './resources/trade/tradeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bias: biasReducer,
    rule: ruleReducer,
    trade: tradeReducer,
  },
});

// ✅ Correctly infer types *after* store is declared
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
