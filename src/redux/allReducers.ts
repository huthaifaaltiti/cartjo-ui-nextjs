import { combineReducers } from "@reduxjs/toolkit";
import verifyEmailReducer from "./slices/authorization/verifyEmail";
import forgotPasswordReducer from "./slices/authorization/forgotPassword";
import generalReducer from "./slices/general";
import cartReducer from "./slices/cart";
import authenticationReducer from "./slices/authentication";
import wishlistReducer from "./slices/wishlist";
import ordersReducer from "./slices/orders";

const allReducers = combineReducers({
  general: generalReducer,
  verifyEmail: verifyEmailReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  authentication: authenticationReducer,
  wishlist: wishlistReducer,
  orders: ordersReducer,
});

export default allReducers;
