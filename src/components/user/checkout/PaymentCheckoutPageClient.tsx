"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import OrderSummary from "./OrderSummary";
import { PaymentData } from "@/types/payment.types";
import CardsPayment from "./CardsPayment";
import CashPayment from "./CashPayment";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { useCartQuery } from "@/hooks/react-query/useCartQuery";
import { setCartItems } from "@/redux/slices/cart";
import { CartItem } from "@/types/cartItem.type";
import PageLoader from "@/components/shared/PageLoader";
import NoCartItems from "../cart/NoCartItems";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import AuthRedirect from "@/components/shared/AuthRedirect";

export default function PaymentCheckoutPageClient() {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const { data, isLoading, isError, error } = useCartQuery();

  const fetchedItems = useMemo(
    () => data?.pages?.flatMap((page) => page?.data?.items || []) ?? [],
    [data],
  );

  const cartSummary = useMemo(() => {
    const firstPage = data?.pages?.[0]?.data;
    return {
      totalAmount: firstPage?.totalAmount ?? 0,
      itemsCount: firstPage?.itemsCount ?? 0,
      totalItemsCount: firstPage?.totalItemsCount ?? 0,
    };
  }, [data]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>(
    PaymentMethods.Cash,
  );
  const [paymentData] = useState<PaymentData | null>(null);
  // const [orderEncrypted, setOrderEncrypted] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedItems.length > 0) {
      dispatch(
        setCartItems({
          items: fetchedItems as CartItem[],
          totalAmount: cartSummary.totalAmount,
          itemsCount: cartSummary.itemsCount,
          totalItemsCount: cartSummary.totalItemsCount,
        }),
      );
    }
  }, [fetchedItems, cartSummary, dispatch]);

  const showLoader = isLoading || isSessionLoading;
  const showData = (cartItems as CartItem[])?.length !== 0;
  const showNoData = !cartItems || (cartItems as CartItem[])?.length === 0;


  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation="/checkout" />;
  }

  if (isError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={error?.message || t("routes.checkout.errors.failedLoadData")}
        />
      </div>
    );
  }

  if (showNoData) {
    return <NoCartItems />;
  }

  if (showData) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <PaymentInitializer
            accessToken={accessToken}
            email={sessionData?.user?.email}
            totalAmount={totalAmount}
            setPaymentData={setPaymentData}
            setOrderEncrypted={setOrderEncrypted}
            setVerifiedOrder={() => {}}
            setError={setError}
            orderEncrypted={orderEncrypted}
          /> */}

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            {paymentMethod === PaymentMethods.Card && <CardsPayment />}
            {paymentMethod === PaymentMethods.Cash && <CashPayment />}
            {paymentData && <div>paymentData</div>}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
