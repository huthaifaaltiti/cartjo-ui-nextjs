import { memo } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Product } from "@/types/product.type";
import RecProductCard from "./RecProductCard";

interface RecProductsDataProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

const RecProductsData = ({
  title,
  subtitle,
  products,
}: RecProductsDataProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          {title || t("routes.product.components.RecProductsData.title")}
        </h2>

        <p className="text-gray-600">
          {subtitle || t("routes.product.components.RecProductsData.subTitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <RecProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default memo(RecProductsData);
