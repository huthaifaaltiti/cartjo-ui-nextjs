import { configureStore } from "@reduxjs/toolkit";
import allReducers from "./allReducers";

export const store = configureStore({
  reducer: allReducers,
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
