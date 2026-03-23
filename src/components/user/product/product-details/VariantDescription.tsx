import { VariantServer } from "@/types/product.type";

interface Props {
  variant: VariantServer;
  isArabic: boolean;
}

const VariantDescription = ({ variant, isArabic }: Props) => {
  const description = isArabic
    ? variant?.description?.ar
    : variant?.description?.en;

  return <p className="text-sm text-gray-600 leading-relaxed">{description}</p>;
};

export default VariantDescription;
