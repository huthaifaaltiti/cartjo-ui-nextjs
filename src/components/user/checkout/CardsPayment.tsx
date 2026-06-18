"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import PaymentForm from "./PaymentForm";
import { PaymentData, VerifiedOrder } from "@/types/payment.types";

export default function CardsPayment() {
  const formRef = useRef<HTMLFormElement>(null);

  const [paymentData] = useState<PaymentData | null>(null);
  const [verifiedOrder] = useState<VerifiedOrder | null>(null);
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
        error={error}
        setError={setError}
      />
    </>
  );
}
