"use client";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AlertCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { PaymentData, VerifiedOrder } from "@/types/payment.types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslations } from "use-intl";
import { Currency } from "@/enums/currency.enum";
import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import Modal from "@/components/shared/Modal";
import ShippingAddressForm, { ShippingAddress } from "./ShippingAddressForm";

interface PaymentFormProps {
  formRef: RefObject<HTMLFormElement | null>;
  paymentData: PaymentData | null;
  verifiedOrder: VerifiedOrder | null;
  accessToken: string | null;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function PaymentForm({
  formRef,
  paymentData,
  verifiedOrder,
  accessToken,
  error,
  setError,
}: PaymentFormProps) {
  const t = useTranslations("routes.checkout.components.PaymentForm");
  const { totalAmount } = useSelector((state: RootState) => state.cart);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardType, setCardType] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return null;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
      setCardType(detectCardType(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setCardHolder(value.toUpperCase());
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="lg:col-span-3">
        <div className="bg-white-50 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t("paymentDetails")}
            </h1>
            <p className="text-slate-600">{t("securePurchase")}</p>

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

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* CARD NUMBER */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("cardNumber")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3.5 pl-12 pr-16 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-mono"
                  required
                />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                {cardType && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {cardType === "visa" && (
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        VISA
                      </div>
                    )}
                    {cardType === "mastercard" && (
                      <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        MC
                      </div>
                    )}
                    {cardType === "amex" && (
                      <div className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">
                        AMEX
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("expiryDate")}
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-colors text-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("cvv")}
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-colors text-lg font-mono"
                  required
                />
              </div>
            </div>

            {/* Card Holder */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("cardHolder")}
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={handleCardHolderChange}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-colors text-lg uppercase"
                required
              />
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    {t("securePayment")}
                  </p>
                  <p className="text-xs text-green-700">
                    {t("secureDescription")}
                  </p>
                </div>
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={!paymentData || isProcessing || !shippingAddress}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("processing")}
                </span>
              ) : !paymentData ? (
                t("loading")
              ) : (
                `${t("pay")} ${
                  verifiedOrder?.amount || totalAmount.toFixed(2)
                } ${verifiedOrder?.currency || Currency.JOD}`
              )}
            </button>

            {/* Badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>{t("sslEncrypted")}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{t("pciCompliant")}</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Shipping Modal */}
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
