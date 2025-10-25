import { combineReducers } from "@reduxjs/toolkit";
import verifyEmailReducer from "./slices/auth/verifyEmail";
import forgotPasswordReducer from "./slices/auth/forgotPassword";
import generalReducer from "./slices/general";

const allReducers = combineReducers({
  verifyEmail: verifyEmailReducer,
  forgotPassword: forgotPasswordReducer,
  general: generalReducer,
});

export default allReducers;
