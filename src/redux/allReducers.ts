import { combineReducers } from "@reduxjs/toolkit";
import verifyEmailReducer from "./slices/auth/verifyEmail";
import forgotPasswordReducer from "./slices/auth/forgotPassword";

const allReducers = combineReducers({
  verifyEmail: verifyEmailReducer,
  forgotPassword: forgotPasswordReducer,
});

export default allReducers;
