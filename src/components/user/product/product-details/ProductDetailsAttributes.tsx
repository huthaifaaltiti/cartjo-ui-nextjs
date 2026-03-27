import { useTranslations } from "next-intl";

interface Props {
  size?: string;
  sellingType?: string;
  sku?: string;
}

const ProductDetailsAttributes = ({ size, sellingType, sku }: Props) => {
  const t = useTranslations("general.attributes");

  return (
    <div className="flex flex-col gap-2 text-sm text-gray-600">
      {size && (
        <p>
          <strong>{t("labels.size")}:</strong> {t(`size.${size.toLowerCase()}`)}
        </p>
      )}

      {sellingType && (
        <p>
          <strong>{t("labels.type")}:</strong>{" "}
          {t(`sellingType.${sellingType.toLowerCase()}`)}
        </p>
      )}

      {sku && (
        <p>
          <strong>{t("labels.sku")}:</strong> {sku}
        </p>
      )}
    </div>
  );
};

export default ProductDetailsAttributes;
