"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { Currency } from "@/enums/currency.enum";

const CartOrderStatus: React.FC = () => {
  const t = useTranslations("routes.cart.components.CartOrderStatus");
  const { items, totalAmount, totalItemsCount } = useSelector(
    (state: RootState) => state.cart
  );
  const [isProcessing] = useState(false);

  return (
    <div className="w-full min-h-[20vh] h-auto mt-9 px-4 py-4 bg-white-50 border border-gray-100 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("title")}</h2>

      <div className="flex justify-between mb-2 text-gray-700">
        <span>
          {t("subtotal")} ({totalItemsCount}{" "}
          {t(totalItemsCount === 1 ? "item" : "items")})
        </span>
        <span>
          {Currency.JOD} {totalAmount?.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between font-bold text-lg mb-4 border-t pt-2">
        <span>{t("total")}</span>
        <span>
          {Currency.JOD} {totalAmount.toFixed(2)}
        </span>
      </div>

      <Link href={"/checkout"}>
        <Button
          className="w-full bg-primary-500 text-white-50 py-2 rounded hover:bg-primary-600"
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? t("processing") : t("proceed")}
        </Button>
      </Link>
    </div>
  );
};

export default CartOrderStatus;
