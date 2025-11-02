import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendIdentifier } from "./actions";

interface ForgotPasswordState {
  currentStep: number;
  identifier: string;
  identifierType: "email" | "phone" | "username";
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
  errors: Record<string, string>;
  isLoading: boolean;
  successMessage?: string;
}

const initialState: ForgotPasswordState = {
  currentStep: 0,
  identifier: "",
  identifierType: "email",
  verificationCode: "",
  newPassword: "",
  confirmPassword: "",
  errors: {},
  isLoading: false,
  successMessage: undefined,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    resetForgotPasswordState: () => initialState,

    setIdentifier: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      state.identifier = value;

      // Auto detect type
      if (value.includes("@")) state.identifierType = "email";
      else if (/^\+?[\d\s-()]+$/.test(value)) state.identifierType = "phone";
      else state.identifierType = "username";
    },

    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload.replace(/\D/g, "").slice(0, 6);
    },

    setNewPassword: (state, action: PayloadAction<string>) => {
      state.newPassword = action.payload;
    },

    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },

    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },

  // Handle async actions
  extraReducers: (builder) => {
    builder
      // --- sendIdentifier
      .addCase(sendIdentifier.pending, (state) => {
        state.isLoading = true;
        state.errors = {};
        state.successMessage = undefined;
      })
      .addCase(sendIdentifier.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.isSuccess) {
          state.successMessage = action.payload.message || "";
          state.currentStep = 1; 
        } else {
          state.errors = {
            general: action.payload.message || "Failed to send",
          };
        }
      })
      .addCase(sendIdentifier.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = {
          general:
            action.payload?.message || "Something went wrong, please try again",
        };
      });
  },
});

export const {
  resetForgotPasswordState,
  setIdentifier,
  setVerificationCode,
  setNewPassword,
  setConfirmPassword,
  setStep,
  setErrors,
  setLoading,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
