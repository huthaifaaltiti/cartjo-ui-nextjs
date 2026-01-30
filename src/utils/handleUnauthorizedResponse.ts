import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";
import { redirect } from "next/navigation";

export function handleUnauthorizedResponse(
  res: Response,
  lang: Locale | string,
  navigateTo?: string,
) {
  const description = isArabicLocale(lang)
    ? "انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى"
    : "Session expired, please log in again";

  //  401 Unauthorized and 403 Forbidden HTTP status codes
  const unAuthStatus =
    res.status === 401 ||
    res.status === 403 ||
    res.statusText === "Unauthorized";

  if (unAuthStatus) {
    if (typeof window !== "undefined") {
      window.location.href = navigateTo ?? "/auth";
    } else {
      redirect(navigateTo ?? "/auth");
    }

    throw new Error(description);
  }
}
