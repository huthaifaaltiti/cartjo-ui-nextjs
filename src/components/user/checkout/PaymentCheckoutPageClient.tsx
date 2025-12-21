"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import PaymentInitializer from "./PaymentInitializer";
import OrderSummary from "./OrderSummary";
import { PaymentData } from "@/types/payment.types";
import CardsPayment from "./CardsPayment";
import CashPayment from "./CashPayment";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { useCartQuery } from "@/hooks/react-query/useCartQuery";
import { setCartItems } from "@/redux/slices/cart";

export default function PaymentCheckoutPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { totalAmount } = useSelector((state: RootState) => state.cart);

  const { data } = useCartQuery();

  const { data: sessionData } = useSession();
  const { accessToken } = useAuthContext();

  const fetchedItems = useMemo(
    () => data?.pages?.flatMap((page) => page?.data?.items || []) ?? [],
    [data]
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>(
    PaymentMethods.Cash
  );
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orderEncrypted, setOrderEncrypted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedItems.length > 0) {
      dispatch(setCartItems(fetchedItems));
    }
  }, [fetchedItems]);

  return (
    <>
      <PaymentInitializer
        accessToken={accessToken}
        email={sessionData?.user?.email}
        totalAmount={totalAmount}
        setPaymentData={setPaymentData}
        setOrderEncrypted={setOrderEncrypted}
        setVerifiedOrder={() => {}}
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
                {paymentData && <div>paymentData</div>}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
