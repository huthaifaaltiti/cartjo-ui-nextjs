import { Locale } from "@/types/locale";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  locale: Locale;
  dir: "ltr" | "rtl";
}

const initialState: GeneralState = {
  locale: "en",
  dir: "ltr",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    resetGeneralSlice: () => initialState,

    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },

    setDirection: (state, action: PayloadAction<"ltr" | "rtl">) => {
      state.dir = action.payload;
    },
  },
});

export const { resetGeneralSlice, setLocale, setDirection } =
  generalSlice.actions;

export default generalSlice.reducer;
