'use client';

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Trash } from "lucide-react";
import CounterDown from "@/components/shared/CounterDown";

const RemoveItemFromCartBtn = ({
  showCounter,
  isLoading,
  handleRemoveFromCart,
}: {
  showCounter: boolean;
  isLoading: boolean;
  handleRemoveFromCart: () => void;
}) => {
  const t = useTranslations();

  return (
    <div>
      {showCounter && (
        <CounterDown
          startCounting={showCounter}
          countDownAmount={5}
          withRelocation={false}
          withDirMessage={false}
          dirMessage={""}
          relocationPath="/auth?redirectTo=/cart&resend=false"
          size="md"
          color="purple"
          align="center"
        />
      )}

      {!showCounter && (
        <div>
          <button
            onClick={() => handleRemoveFromCart()}
            disabled={isLoading}
            className={`w-full h-14 group/btn relative overflow-hidden font-semibold py-3.5 px-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-xl`}
          >
            <div
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                isLoading
                  ? "bg-white-50/30"
                  : "bg-white-50/20 group-hover/btn:bg-white-50/30 group-hover/btn:scale-110"
              }`}
            >
              <Trash className="w-5 h-5" />
            </div>

            <span className="text-sm font-bold tracking-wide">
              {t("routes.cart.components.CartProductCard.removeFromCartLabel")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(RemoveItemFromCartBtn);
