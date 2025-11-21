"use client";

import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ShippingAddressForm, { ShippingAddress } from "./ShippingAddressForm";
import Modal from "@/components/shared/Modal";

export default function CashPayment() {
  const { totalAmount } = useSelector((state: RootState) => state.cart);
  const { accessToken } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [cashOrderProcessing, setCashOrderProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  const handleCashPayment = async () => {
    if (!accessToken) {
      setError("You must be logged in to place an order");
      return;
    }

    if (!shippingAddress) {
      setError("Please fill the shipping address first.");
      return;
    }

    setCashOrderProcessing(true);
    setError(null);

    try {
      // Call your backend to create a cash order
      const response = await fetch("/api/orders/create-cash-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          totalAmount,
          paymentMethod: "cash",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create cash order");
      }

      const data = await response.json();

      // Redirect to success page or show confirmation
      window.location.href = `/order-confirmation/${data.orderId}`;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process cash order"
      );
    } finally {
      setCashOrderProcessing(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Cash on Delivery
          </h3>

          <p className="text-green-800 mb-4">
            Pay with cash when your order is delivered to your doorstep.
          </p>

          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Have exact change ready</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Payment is due upon delivery</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Inspect your order before payment</span>
            </li>
          </ul>

          {/* Show shipping status */}
          <div className="mt-4">
            {!shippingAddress ? (
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="text-blue-600 underline text-sm"
              >
                + Add Shipping Address
              </button>
            ) : (
              <p className="text-green-700 text-sm font-medium">
                ✓ Shipping address added
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleCashPayment}
          disabled={cashOrderProcessing || !accessToken || !shippingAddress}
          className="w-full bg-green-600 text-white-50 py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {cashOrderProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Place Order (Cash on Delivery)"
          )}
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ShippingAddressForm
          onComplete={(data) => {
            setShippingAddress(data);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
