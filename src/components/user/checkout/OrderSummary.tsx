import { VerifiedOrder } from "@/types/payment.types";
import { useTranslations } from "next-intl";

interface OrderSummaryProps {
  verifiedOrder: VerifiedOrder | null;
}

export default function OrderSummary({ verifiedOrder }: OrderSummaryProps) {
  const t = useTranslations("routes.checkout.components.OrderSummary");

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
      <h2 className="text-2xl font-bold mb-6">{t("orderSummary")}</h2>

      {!verifiedOrder ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>
              {verifiedOrder.amount} {verifiedOrder.currency}
            </span>
          </div>

          <div className="flex justify-between py-4">
            <span>{t("total")}</span>
            <span className="text-xl font-bold">
              {verifiedOrder.amount} {verifiedOrder.currency}
            </span>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">{t("billingTo")}:</p>
            <p>{verifiedOrder.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
