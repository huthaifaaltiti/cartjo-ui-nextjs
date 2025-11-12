"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PaymentCheckoutPage: React.FC = () => {
  const searchParams = useSearchParams();
  const merchantReference = searchParams.get("ref");
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate card number (basic Luhn algorithm check)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "");
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = "Invalid card number";
    }
    
    // Validate cardholder name
    if (formData.cardHolderName.trim().length < 3) {
      newErrors.cardHolderName = "Please enter cardholder name";
    }
    
    // Validate expiry date
    const expiryClean = formData.expiryDate.replace(/\D/g, "");
    if (expiryClean.length !== 4) {
      newErrors.expiryDate = "Invalid expiry date";
    } else {
      const month = parseInt(expiryClean.slice(0, 2));
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month";
      }
    }
    
    // Validate CVV
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "Invalid CVV";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value.replace(/\D/g, "").slice(0, 19));
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get tokenization form data from backend
      const response = await fetch("/api/payment/tokenize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantReference,
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          cardHolderName: formData.cardHolderName,
          expiryDate: formData.expiryDate.replace(/\D/g, "").slice(2) + formData.expiryDate.replace(/\D/g, "").slice(0, 2), // Convert MM/YY to YYMM
          cvv: formData.cvv
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to prepare tokenization");
      }

      const { formAction, formData: tokenData } = await response.json();
      
      // Create and submit hidden form to APS
      const form = document.createElement("form");
      form.method = "POST";
      form.action = formAction;
      
      Object.keys(tokenData).forEach(key => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = tokenData[key];
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h1>
        
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cardHolderName">Cardholder Name</Label>
            <Input
              id="cardHolderName"
              name="cardHolderName"
              type="text"
              placeholder="John Doe"
              value={formData.cardHolderName}
              onChange={handleInputChange}
              className={errors.cardHolderName ? "border-red-500" : ""}
            />
            {errors.cardHolderName && (
              <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <img src="/visa.svg" alt="Visa" className="h-8" />
          <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
          <img src="/amex.svg" alt="Amex" className="h-8" />
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentCheckoutPage;