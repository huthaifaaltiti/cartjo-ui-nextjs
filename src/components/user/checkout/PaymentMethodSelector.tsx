"use client";

import React from "react";
import { PaymentMethods } from "@/enums/paymentMethods.enum";

interface PaymentMethodSelectorProps {
  selected: PaymentMethods;
  onChange: (method: PaymentMethods) => void;
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Select Payment Method
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {/* CARD */}
        <button
          type="button"
          disabled
          // onClick={() => onChange(PaymentMethods.Card)}
          className={`p-4 border-2 rounded-lg bg-gray-100 cursor-not-allowed opacity-50`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#1434CB" />
              <path
                d="M20 10h8l-2 12h-3l2-12zm-5 0l-3 8.5-.5-2.5-1.5-5c0-.5-.5-1-1-1H4l0 .5c2 .5 4 1.5 5.5 2.5l4.5 9h3l5-12h-3zm23 0h-2.5c-.5 0-1 .5-1 1l-4 11h3l.5-1.5h3.5l.5 1.5h2.5l-2.5-12zm-3 8l1.5-4 .5 4h-2z"
                fill="white"
              />
            </svg>

            <span className="font-semibold">Credit/Debit Card</span>
          </div>
          <p className="text-xs text-red-500 mt-1">Unavailable</p>
        </button>

        {/* CASH */}
        <button
          type="button"
          onClick={() => onChange(PaymentMethods.Cash)}
          className={`p-4 border-2 rounded-lg transition-all ${
            selected === "cash"
              ? "border-green-600 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span className="font-semibold">Cash on Delivery</span>
          </div>
        </button>
      </div>
    </div>
  );
}
