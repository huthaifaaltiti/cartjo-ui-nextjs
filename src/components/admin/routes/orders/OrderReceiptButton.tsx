"use client";

import React, { useState, useMemo, memo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useResolvedImages } from "@/hooks/useResolvedImages";
import ReceiptPDF from "./ReceiptPDF";
import { Order } from "@/types/order.type";
import { OrderItem } from "@/types/orderItem.type";
import { isArabicLocale } from "@/config/locales.config";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface OrderReceiptButtonProps {
  selectedOrder: Order;
  locale: string;
}

const OrderReceiptButton = ({
  selectedOrder,
  locale,
}: OrderReceiptButtonProps) => {
  const t = useTranslations(
    "routes.dashboard.routes.orders.components.OrderReceiptButton",
  );
  const tFile = useTranslations(
    "routes.dashboard.routes.orders.components.ReceiptPDF",
  );
  const tg = useTranslations("general");

  const [isPreparing, setIsPreparing] = useState(false);

  const imageUrls = useMemo(() => {
    if (!isPreparing || !selectedOrder?.items) return [];

    const urls = selectedOrder.items.map(
      (item: OrderItem) =>
        item?.variant?.mainImage?.url || item?.mainImage?.url,
    );
    return Array.from(new Set(urls.filter((url): url is string => !!url)));
  }, [selectedOrder?.items, isPreparing]);

  const { imageMap, loading: imagesLoading } = useResolvedImages(imageUrls);

  const isReady =
    isPreparing &&
    !imagesLoading &&
    Object.keys(imageMap).length === imageUrls.length;

  if (!isPreparing) {
    return (
      <Button
        onClick={() => setIsPreparing(true)}
        className="bg-primary-500 text-white-50 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {t("downloadReceiptPDF")}
      </Button>
    );
  }

  if (!isReady) {
    return (
      <Button
        disabled
        className="bg-gray-200 text-gray-500 cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
      >
        <span className="h-3 w-3 animate-spin border-2 border-gray-400 border-t-transparent rounded-full" />
        {t("preparingPDF")}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      // Force re-render of the PDF document once images are in memory
      key={Object.keys(imageMap).length}
      document={
        <ReceiptPDF
          selectedOrder={selectedOrder}
          isArabic={isArabicLocale(locale)}
          imageMap={imageMap}
          t={tFile}
          tg={tg}
        />
      }
      fileName={`order-${selectedOrder.transactionId}-receipt.pdf`}
      className="bg-green-600 text-white-50 hover:bg-green-700 rounded-md px-4 py-2 text-sm font-medium transition-colors"
    >
      {({ loading }) => (loading ? t("generatingPDF") : t("savePDF"))}
    </PDFDownloadLink>
  );
};

export default memo(OrderReceiptButton);
