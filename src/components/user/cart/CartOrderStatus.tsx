"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { Currency } from "@/enums/currency.enum";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CurrencyLabel from "@/components/shared/CurrencyLabel";

const CartOrderStatus: React.FC = () => {
  const t = useTranslations("routes.cart.components.CartOrderStatus");
  const { items, totalAmount, totalItemsCount, itemsCount } = useSelector(
    (state: RootState) => state.cart,
  );
  const { isArabic } = useSelector((state: RootState) => state.general);

  const [isProcessing] = useState(false);

  return (
    <div className="w-full mt-9 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">{t("title")}</h2>

      {/* Summary */}
      <div className="space-y-3 text-sm text-gray-700">
        {/* Products count */}
        <div className="flex justify-between">
          <span>{t("itemsCount")}</span>
          <span>
            {itemsCount} {t(itemsCount === 1 ? "item" : "items")}
          </span>
        </div>

        {/* Total units */}
        <div className="flex justify-between">
          <span>{t("totalItemsCount")}</span>
          <span>
            {totalItemsCount} {t(totalItemsCount === 1 ? "item" : "items")}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between border-t pt-3">
          <span>{t("subtotal")}</span>
          <span>
            {totalAmount.toFixed(2)}{" "}
            <CurrencyLabel
              currency={Currency.JOD}
              isArabic={isArabic}
              className="text-xs"
            />
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg mt-4 pt-3 border-t">
        <span>{t("total")}</span>
        <span className="flex items-center gap-1">
          <span>{totalAmount.toFixed(2)}</span>
          <CurrencyLabel
            currency={Currency.JOD}
            isArabic={isArabic}
            className="text-xs"
          />
        </span>
      </div>

      {/* Checkout button */}
      <Link href="/checkout" className="block mt-5">
        <Button
          className="w-full bg-primary-500 text-white-50 hover:bg-primary-600 flex items-center justify-center gap-2"
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? t("processing") : t("proceed")}
          {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </Button>
      </Link>
    </div>
  );
};

export default CartOrderStatus;
