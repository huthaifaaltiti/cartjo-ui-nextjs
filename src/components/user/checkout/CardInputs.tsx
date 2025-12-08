"use client";

import { Dispatch, SetStateAction } from "react";

interface CardInputsProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  setCardNumber: Dispatch<SetStateAction<string>>;
  setExpiryDate: Dispatch<SetStateAction<string>>;
  setCvv: Dispatch<SetStateAction<string>>;
  setCardHolder: Dispatch<SetStateAction<string>>;
}

export default function CardInputs({
  cardNumber,
  expiryDate,
  cvv,
  cardHolder,
  setCardNumber,
  setExpiryDate,
  setCvv,
  setCardHolder,
}: CardInputsProps) {
  return (
    <>
      {/* Card number */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Card Number</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border p-3 rounded-lg"
          placeholder="MM/YY"
        />
        <input
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="border p-3 rounded-lg"
          placeholder="CVV"
        />
      </div>

      {/* Cardholder name */}
      <input
        value={cardHolder}
        onChange={(e) => setCardHolder(e.target.value)}
        className="w-full border p-3 rounded-lg"
        placeholder="Cardholder Name"
      />
    </>
  );
}
