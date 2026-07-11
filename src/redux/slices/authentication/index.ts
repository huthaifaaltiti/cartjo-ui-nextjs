import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";
import { isAdminClientSide } from "@/utils/session-access.utils";

interface AuthenticationState {
  isAuthenticated: boolean;
  session: CartJOSession | TokenSession | null;
  isAdmin: boolean;
  loading: boolean;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  session: null,
  isAdmin: false,
  loading: true,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<CartJOSession | TokenSession>,
    ) => {
      state.session = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = isAdminClientSide(action.payload);
      state.loading = false;
    },

    // On logout or session expiry
    clearSession: () => ({ ...initialState }),

    // Call this on app boot to hydrate from server (passed via initialSession prop)
    hydrateSession: (
      state,
      action: PayloadAction<CartJOSession | TokenSession | null>,
    ) => {
      state.session = action.payload;
      state.isAuthenticated = action.payload !== null;
      state.isAdmin = isAdminClientSide(action.payload);
      state.loading = false;
    },

    resetAuthenticationSliceState: () => ({ ...initialState }),
  },
});

export const {
  setSession,
  clearSession,
  hydrateSession,
  resetAuthenticationSliceState,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
