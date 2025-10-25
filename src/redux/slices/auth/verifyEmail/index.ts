import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { verifyEmail, reVerifyEmail } from "./actions";

export interface VerifyEmailSubState {
  message: string;
  status: "idle" | "loading" | "success" | "error";
  isSuccess: boolean;
}

export interface VerifyEmailState {
  verify: VerifyEmailSubState;
  reverify: VerifyEmailSubState;
}

const initialSubState: VerifyEmailSubState = {
  message: "",
  status: "idle",
  isSuccess: false,
};

const initialState: VerifyEmailState = {
  verify: { ...initialSubState },
  reverify: { ...initialSubState },
};

const verifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    resetVerifyEmailState: () => initialState,
    setVerifyEmailStatus: (
      state,
      action: PayloadAction<{
        key: "verify" | "reverify";
        status: VerifyEmailSubState["status"];
        message: string;
        isSuccess?: boolean;
      }>
    ) => {
      const { key, status, message, isSuccess } = action.payload;

      state[key].status = status;
      state[key].message = message;
      state[key].isSuccess = isSuccess ?? false;
    },
  },
  extraReducers: (builder) => {
    builder
      // verifyEmail
      .addCase(verifyEmail.pending, (state) => {
        state.verify.status = "loading";
        state.verify.message = "";
        state.verify.isSuccess = false;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verify.status = action.payload.isSuccess ? "success" : "error";
        state.verify.message = action.payload.message || "";
        state.verify.isSuccess = action.payload.isSuccess;
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.verify.status = "error";
        state.verify.message = "Verification failed";
        state.verify.isSuccess = false;
      })

      // reVerifyEmail
      .addCase(reVerifyEmail.pending, (state) => {
        state.reverify.status = "loading";
        state.reverify.message = "";
        state.reverify.isSuccess = false;
      })
      .addCase(reVerifyEmail.fulfilled, (state, action) => {
        state.reverify.status = action.payload.isSuccess ? "success" : "error";
        state.reverify.message = action.payload.message || "";
        state.reverify.isSuccess = action.payload.isSuccess;
      })
      .addCase(reVerifyEmail.rejected, (state) => {
        state.reverify.status = "error";
        state.reverify.message = "Re-verification failed";
        state.reverify.isSuccess = false;
      });
  },
});

export const { resetVerifyEmailState, setVerifyEmailStatus } =
  verifyEmailSlice.actions;

export default verifyEmailSlice.reducer;
