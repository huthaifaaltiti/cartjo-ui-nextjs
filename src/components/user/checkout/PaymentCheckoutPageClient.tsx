"use client";

import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import PaymentInitializer from "./PaymentInitializer";
import OrderSummary from "./OrderSummary";
import { PaymentData, VerifiedOrder } from "@/types/payment.types";
import CardsPayment from "./CardsPayment";
import CashPayment from "./CashPayment";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { PaymentMethods } from "@/enums/paymentMethods.enum";

export default function PaymentCheckoutPageClient() {
  const { totalAmount } = useSelector((state: RootState) => state.cart);
  const { data: sessionData } = useSession();
  const { accessToken } = useAuthContext();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>(PaymentMethods.Cash);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orderEncrypted, setOrderEncrypted] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <>
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

      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={(val) => setPaymentMethod(val)}
                />

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {paymentMethod === PaymentMethods.Card && <CardsPayment />}
                {paymentMethod === PaymentMethods.Cash && <CashPayment />}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary verifiedOrder={verifiedOrder} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
