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

export default function CardsPayment() {
  const formRef = useRef<HTMLFormElement>(null);
  const { accessToken } = useAuthContext();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
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

      <PaymentForm
        formRef={formRef}
        paymentData={paymentData}
        verifiedOrder={verifiedOrder}
        accessToken={accessToken}
        error={error}
        setError={setError}
      />
    </>
  );
}
