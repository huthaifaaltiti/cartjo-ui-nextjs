import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props {
  onClick: () => void;
  loading: boolean;
  added: boolean;
  disabled: boolean;
}

const ProductDetailsAddToCartButton = ({
  onClick,
  loading,
  added,
  disabled,
}: Props) => {
  const t = useTranslations(
    "routes.product.components.ProductDetailsAddToCartButton",
  );

  const label = added ? t("added") : t("add");

  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex-1 h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
        added
          ? "bg-emerald-500"
          : "bg-indigo-500 hover:bg-indigo-600 text-white-50"
      }`}
    >
      {added ? <Check size={16} strokeWidth={3} /> : <ShoppingCart size={16} />}
      {label}
    </Button>
  );
};

export default ProductDetailsAddToCartButton;
