import { createSlice } from "@reduxjs/toolkit";

interface GeneralState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: GeneralState = {
  isAuthenticated: false,
  token: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    resetAuthenticationSliceState: () => ({ ...initialState }),
  },
});

export const { resetAuthenticationSliceState } = authenticationSlice.actions;
export default authenticationSlice.reducer;
