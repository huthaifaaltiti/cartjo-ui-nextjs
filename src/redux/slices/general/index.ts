import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Direction = "rtl" | "ltr";

interface GeneralState {
  locale: Locale;
  isArabic: boolean;
  dir: Direction;
}

const initialState: GeneralState = {
  locale: "en",
  isArabic: false,
  dir: "ltr",
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
