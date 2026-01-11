import { createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";

export interface LoginState {
  isLoading: boolean;
  error: object | null;
  message: string;
  token?: string | undefined;
  status?: "idle" | "loading" | "success" | "error";
}

const initialState: LoginState = {
  isLoading: false,
  error: null,
  message: "",
  token: undefined,
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
        const { token, message } = payload;

        state.isLoading = false;
        state.status = "success";
        state.message = message;
        state.token = token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "error";
        state.message = action.payload?.message || "Authentication failed";
        state.token = undefined;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
