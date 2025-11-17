"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import PaymentInitializer from "./PaymentInitializer";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import { PaymentData, VerifiedOrder } from "@/types/payment.types";

export default function PaymentCheckoutPageClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const { totalAmount } = useSelector((state: RootState) => state.cart);
  const { data: sessionData } = useSession();
  const { accessToken } = useAuthContext();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orderEncrypted, setOrderEncrypted] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      {/* PAYTABS SCRIPT */}
      <Script
        src="https://secure-jordan.paytabs.com/payment/js/paylib.js"
        strategy="afterInteractive"
      />
      
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <PaymentInitializer
                accessToken={accessToken}
                email={sessionData?.user?.email}
                totalAmount={totalAmount}
                setPaymentData={setPaymentData}
                setOrderEncrypted={setOrderEncrypted}
                setVerifiedOrder={setVerifiedOrder}
                setError={setError}
                orderEncrypted={orderEncrypted}
              />

              <PaymentForm
                formRef={formRef}
                paymentData={paymentData}
                verifiedOrder={verifiedOrder}
                accessToken={accessToken}
                error={error}
                setError={setError}
              />
            </div>

            <div className="lg:col-span-2">
              <OrderSummary verifiedOrder={verifiedOrder} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
