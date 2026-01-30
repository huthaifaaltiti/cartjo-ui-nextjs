import { createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";

export interface LoginState {
  isLoading: boolean;
  error: object | null;
  message: string;
  token?: string | undefined;
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
  expiresInToken?: number | undefined;
  status?: "idle" | "loading" | "success" | "error";
}

const initialState: LoginState = {
  isLoading: false,
  error: null,
  message: "",
  token: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  expiresInToken: undefined,
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
        state.isLoading = false;
        state.status = "success";
        state.message = payload.message;

        state.token = payload.accessToken;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.expiresInToken = payload.expiresIn;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "error";
        state.message = action.payload?.message || "Authentication failed";

        state.token = undefined;
        state.accessToken = undefined;
        state.refreshToken = undefined;
        state.expiresInToken = undefined;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
