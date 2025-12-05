"use client";

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
            className={`w-full h-auto group/btn relative overflow-hidden font-semibold py-2 px-1 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-xl`}
          >
            <Trash className="w-5 h-5" />

            <span className="text-lg font-bold tracking-wide capitalize">
              {t("routes.cart.components.CartProductCard.removeFromCartLabel")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(RemoveItemFromCartBtn);
