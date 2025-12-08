import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";
import { redirect } from "next/navigation";

export function handleUnauthorizedResponse(
  res: Response,
  lang: Locale | string
) {
  const description = isArabicLocale(lang)
    ? "انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مرة أخرى"
    : "Session expired, please log in again";

  //  401 Unauthorized and 403 Forbidden HTTP status codes
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    } else {
      redirect("/auth");
    }

    throw new Error(description);
  }
}
