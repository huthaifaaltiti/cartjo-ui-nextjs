"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { PaymentData, VerifiedOrder } from "@/types/payment.types";
import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Currency } from "@/enums/currency.enum";
import { SubmitPaymentResponse } from "./PaymentForm";

interface PaymentInitializerProps {
  accessToken: string | null;
  email: string | undefined | null;
  totalAmount: number;
  orderEncrypted: string | null;
  setPaymentData: Dispatch<SetStateAction<PaymentData | null>>;
  setOrderEncrypted: Dispatch<SetStateAction<string | null>>;
  setVerifiedOrder: Dispatch<SetStateAction<VerifiedOrder | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function PaymentInitializer({
  accessToken,
  email,
  totalAmount,
  orderEncrypted,
  setPaymentData,
  setOrderEncrypted,
  setVerifiedOrder,
  setError,
}: PaymentInitializerProps) {
  // 1) Create signature
  useEffect(() => {
    if (!accessToken) return;

    const init = async () => {
      const url = new URL(API_ENDPOINTS.CHECKOUT.PROCESS_PAYMENT);

      try {
        const resp = await fetcher<SubmitPaymentResponse>(
          url.toString(),

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              lang: "en",
              amount: Number(totalAmount.toFixed(2)),
              currency: Currency.JOD,
              customer_email: email || "test@test.com",
            }),
          }
        );

        // if (resp?.isSuccess && resp.data) {
        //   setPaymentData(resp?.data);

        //   const url = new URL(resp.data.return_url);
        //   const encrypted = url.searchParams.get("order");

        //   setOrderEncrypted(encrypted);
        // }
      } catch (err) {
        setError("Failed to initialize payment.");
        console.log({err})
      }
    };

    init();
  }, [accessToken]);

  // 2) Verify encrypted order
  useEffect(() => {
    if (!orderEncrypted || !accessToken) return;

    const verify = async () => {
      const url = new URL(API_ENDPOINTS.CHECKOUT.VERIFY_PAYMENT);

      try {
        const resp = await fetcher(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ encryptedOrder: orderEncrypted }),
        });

        // if (resp?.isSuccess) setVerifiedOrder(resp.data);
      } catch (err) {
        setError("Failed to verify payment.");
        console.log({err})
      }
    };

    verify();
  }, [orderEncrypted]);

  return null;
}
