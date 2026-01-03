import { isArabicLocale } from "@/config/locales.config";
import { Direction } from "@/types/common";
import { Locale } from "@/types/locale";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  locale: Locale;
  isArabic: boolean;
  dir: Direction;
}

const initialState: GeneralState = {
  locale: "ar",
  isArabic: true,
  dir: "rtl",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    resetGeneralState: () => ({ ...initialState }),
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
      state.isArabic = isArabicLocale(state.locale);
      state.dir = action.payload === "ar" ? "rtl" : "ltr";
    },
  },
});

export const { resetGeneralState, setLocale } = generalSlice.actions;
export default generalSlice.reducer;
