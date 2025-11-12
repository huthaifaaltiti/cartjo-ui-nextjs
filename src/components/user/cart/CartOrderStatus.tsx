"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CartOrderStatus: React.FC = () => {
  const t = useTranslations("routes.cart.components.CartOrderStatus");
  const { items, totalAmount, totalItemsCount } = useSelector(
    (state: RootState) => state.cart
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Create a unique merchant reference
      const merchantReference = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert amount to minor units (multiply by 100 for AED)
      const amountInMinorUnits = Math.round(totalAmount * 100);
      
      // Prepare order data for backend
      const orderData = {
        merchantReference,
        amount: amountInMinorUnits,
        currency: "AED", // Change based on your currency
        customerEmail: "customer@example.com", // Get from user session/profile
        items: items.map(item => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        returnUrl: `${window.location.origin}/payment/result`
      };

      // Call your backend API to initiate payment
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const paymentData = await response.json();
      
      // Redirect to payment page with tokenization form
      window.location.href = `/payment/checkout?ref=${merchantReference}`;
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-[20vh] h-auto mt-9 px-4 py-4 bg-white-50 border border-gray-100 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("title")}</h2>

      <div className="flex justify-between mb-2 text-gray-700">
        <span>
          {t("subtotal")} ({totalItemsCount} items)
        </span>
        <span>${totalAmount?.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-bold text-lg mb-4 border-t pt-2">
        <span>{t("total")}</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>

      <Button
        onClick={handleCheckout}
        className="w-full bg-primary-500 text-white-50 py-2 rounded hover:bg-primary-600"
        disabled={items.length === 0 || isProcessing}
      >
        {isProcessing ? "Processing..." : t("proceed")}
      </Button>
    </div>
  );
};

export default CartOrderStatus;