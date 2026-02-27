import { VariantServer } from "@/types/product.type";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";

export function extractVariantDetails(variant: VariantServer) {
  const sellingType =
    variant.attributes.find(
      (a) => a.key === ProductVariantAttributeKey.SELLING_TYPE,
    )?.value ?? null;

  const size =
    variant.attributes.find((a) => a.key === ProductVariantAttributeKey.SIZE)
      ?.value ?? null;

  const colors = variant.attributes
    .filter((a) => a.key === ProductVariantAttributeKey.COLOR)
    .map((a) => a.value);

  return { sellingType, size, colors };
}
