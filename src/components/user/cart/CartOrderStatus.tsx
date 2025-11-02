"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

const CartOrderStatus: React.FC = () => {
  const { items, totalAmount, totalItemsCount } = useSelector(
    (state: RootState) => state.cart
  );

  const handleCheckout = () => {};

  return (
    <div className="w-full min-h-[20vh] h-auto mt-9 px-4 py-4 bg-white-50 border border-gray-100 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Order Summary
      </h2>

      {/* Subtotal */}
      <div className="flex justify-between mb-2 text-gray-700">
        <span>Subtotal ({totalItemsCount} items)</span>
        <span>${totalAmount?.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold text-lg mb-4 border-t pt-2">
        <span>Total</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>

      {/* Checkout */}
      <Button
        onClick={handleCheckout}
        className="w-full bg-primary-500 text-white-50 py-2 rounded hover:bg-primary-600"
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartOrderStatus;
