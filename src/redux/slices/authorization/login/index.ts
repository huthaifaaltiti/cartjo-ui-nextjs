import { createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export interface LoginState {
  isLoading: boolean;
  error: object | null;
  message: string;
  loggedInSession: CartJOSession | TokenSession | null;
  status: "idle" | "loading" | "success" | "error";
}

const initialState: LoginState = {
  isLoading: false,
  error: null,
  message: "",
  loggedInSession: null,
  status: "idle",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetLoginState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user, message } = payload;

        state.isLoading = false;
        state.status = "success";
        state.message = message ?? "";
        state.loggedInSession = user ?? null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "error";
        state.message = action.payload?.message ?? "Login failed";
        state.loggedInSession = null;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
