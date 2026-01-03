"use client";

import { Currency } from "@/constants/currency.constant";
import { useAuthContext } from "@/hooks/useAuthContext";
import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import OrderSummarySkeleton from "./OrderSummarySkeleton";
import BackToHomePage from "@/components/shared/BackToHomePage";

export default function OrderSummary() {
  const t = useTranslations("routes.checkout.components.OrderSummary");
  const { totalAmount } = useSelector((state: RootState) => state.cart);
  const { currency } = useSelector((state: RootState) => state.orders);
  const { isArabic } = useSelector((state: RootState) => state.general);

  const { user, isSessionLoading, isAuthenticated } = useAuthContext();

  if (isSessionLoading) {
    return <OrderSummarySkeleton />;
  }

  if (!isAuthenticated || !user?.email) {
    return null;
  }

  const getTotalAmountWithCurrency = (): string =>
    `${totalAmount} ${
      isArabic ? Currency[currency].labelAr : Currency[currency].labelEn
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
      <h2 className="text-2xl font-bold mb-6">{t("orderSummary")}</h2>

      {totalAmount > 0 && user?.email ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>{getTotalAmountWithCurrency()}</span>
          </div>

          {
            <div className="pt-4 border-t flex items-center gap-1">
              <p className="text-sm text-slate-600">{t("billingTo")}:</p>
              <p className="text-sm">{user.email}</p>
            </div>
          }
        </div>
      ) : (
        <div className="pt-4 border-t flex flex-col items-start gap-5">
          <p className="text-sm text-slate-600">{t("discoverHome")}</p>
          <BackToHomePage />
        </div>
      )}
    </div>
  );
}
