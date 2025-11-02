import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  sendIdentifier,
  verifyResetPasswordCode,
  resetPassword,
} from "./actions";

interface ForgotPasswordState {
  currentStep: number;
  identifier: string;
  identifierType: "email" | "phone" | "username";
  verificationCode: string;
  verificationCodeSuccessMessage: string | undefined;
  newPassword: string;
  isNewPasswordSet: boolean;
  confirmPassword: string;
  errors: Record<string, string>;
  isLoading: boolean;
}

const initialState: ForgotPasswordState = {
  currentStep: 0,
  identifier: "",
  identifierType: "email",
  verificationCode: "",
  verificationCodeSuccessMessage: "",
  newPassword: "",
  confirmPassword: "",
  isNewPasswordSet: false,
  errors: {},
  isLoading: false,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    resetForgotPasswordState: () => initialState,

    setIdentifier: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      state.identifier = value;

      if (value.includes("@")) state.identifierType = "email";
      else if (/^\+?[\d\s-()]+$/.test(value)) state.identifierType = "phone";
      else state.identifierType = "username";
    },

    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload.replace(/\D/g, "").slice(0, 6);
    },

    resetVerificationCodeMessage: (state) => {
      state.verificationCodeSuccessMessage = "";
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

  extraReducers: (builder) => {
    builder
      // --- sendIdentifier
      .addCase(sendIdentifier.pending, (state) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(sendIdentifier.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isSuccess) {
          if (state.currentStep === 0) {
            state.currentStep = 1;
            state.verificationCodeSuccessMessage = "";
          } else if (state.currentStep === 1) {
            state.verificationCodeSuccessMessage = action.payload.message;
          }
        } else {
          state.errors = {
            sendIdentifier:
              action.payload.message || "Failed to send identifier",
          };
        }
      })
      .addCase(sendIdentifier.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = {
          sendIdentifier:
            action.payload?.message || "Something went wrong, please try again",
        };
      })

      // --- verifyResetPasswordCode
      .addCase(verifyResetPasswordCode.pending, (state) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(verifyResetPasswordCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isSuccess) {
          state.currentStep = 2;
        } else {
          state.errors = {
            verifyCode: action.payload.message || "Invalid verification code",
          };
        }
      })
      .addCase(verifyResetPasswordCode.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = {
          verifyCode:
            action.payload?.message ||
            "Something went wrong while verifying the code",
        };
      })

      // --- resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isSuccess) {
          state.isNewPasswordSet = true;
        } else {
          state.errors = {
            resetPasswordErr:
              action.payload.message || "Failed to reset password",
          };
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = {
          resetPasswordErr:
            action.payload?.message ||
            "Something went wrong while resetting password",
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
  resetVerificationCodeMessage,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
