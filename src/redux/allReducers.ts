import { combineReducers } from "@reduxjs/toolkit";
import verifyEmailReducer from "./slices/auth/verifyEmail";

const allReducers = combineReducers({
  verifyEmail: verifyEmailReducer,
});

export default allReducers;
