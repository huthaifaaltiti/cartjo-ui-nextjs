"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";
import { SellingType } from "@/enums/sellingType.enum";
import { Size } from "@/enums/size.enum";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

interface VariantAttribute {
  key: ProductVariantAttributeKey;
  value: string;
}

const productVariantAttributeKeys = Object.values(
  ProductVariantAttributeKey,
).map((val) => ({
  name: val.replace(/_/g, " "),
  value: val,
}));

const ProductVariantAttributesSection = ({
  variant,
  variantIndex,
  updateAttribute,
  addAttribute,
  removeAttribute,
  getAttributeError,
  errors,
  isDisabled,
}: any) => {
  const t = useTranslations(
    "routes.dashboard.routes.products.components.ProductVariantAttributesSection",
  );
  const tg = useTranslations("general");

  const attributeValueConfig: Record<
    ProductVariantAttributeKey,
    {
      type: "select" | "text" | "color";
      options?: { label: string; value: string }[];
    }
  > = {
    [ProductVariantAttributeKey.SELLING_TYPE]: {
      type: "select",
      options: [
        { label: tg("attributes.sellingType.set"), value: SellingType.SET },
        { label: tg("attributes.sellingType.piece"), value: SellingType.PIECE },
      ],
    },
    [ProductVariantAttributeKey.SIZE]: {
      type: "select",
      options: [
        { label: tg("attributes.size.small"), value: Size.SMALL },
        { label: tg("attributes.size.medium"), value: Size.MEDIUM },
        { label: tg("attributes.size.large"), value: Size.LARGE },
        { label: '12"', value: "12" },
        { label: '16"', value: "16" },
        { label: '18"', value: "18" },
        { label: '21"', value: "21" },
        { label: '23"', value: "23" },
        { label: '24"', value: "24" },
      ],
    },
    [ProductVariantAttributeKey.COLOR]: {
      type: "color",
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">{t("header")}</h4>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="bg-white-50 border shadow-none hover:shadow-sm hover:bg-gray-50 transition-all"
          onClick={() => addAttribute(variantIndex)}
          disabled={isDisabled}
        >
          <Plus className="h-3 w-3 mr-1" /> {t("addAttribute")}
        </Button>
      </div>

      {errors[variantIndex]?.attributesArray && (
        <div className="text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 rounded-md p-2">
          {errors[variantIndex].attributesArray}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {variant.attributes.map((attr: VariantAttribute, attrIndex: number) => (
          <div
            key={attrIndex}
            className="flex items-start gap-3 bg-slate-50 p-3 rounded-md border border-dashed border-slate-300"
          >
            {/* Attribute Type */}
            <div className="flex-1 min-w-0">
              <label
                className={`text-[10px] uppercase font-bold ${
                  getAttributeError(variantIndex, attrIndex, "key")
                    ? "text-destructive"
                    : "text-slate-500"
                }`}
              >
                {t("attributeType")}
              </label>
              <Select
                value={attr.key}
                onValueChange={(value) =>
                  updateAttribute(
                    variantIndex,
                    attrIndex,
                    "key",
                    value as ProductVariantAttributeKey,
                  )
                }
                disabled={isDisabled}
              >
                <SelectTrigger className="bg-white mt-1">
                  <SelectValue placeholder={t("placeholders.selectKey")} />
                </SelectTrigger>
                <SelectContent>
                  {productVariantAttributeKeys.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Always-rendered error slot — prevents layout shift */}
              <p className="text-sm font-medium text-destructive min-h-[20px] mt-1">
                {(getAttributeError(
                  variantIndex,
                  attrIndex,
                  "key",
                ) as string) || ""}
              </p>
            </div>

            {/* Attribute Value */}
            <div className="flex-1 min-w-0">
              <label
                className={`text-[10px] uppercase font-bold ${
                  getAttributeError(variantIndex, attrIndex, "value")
                    ? "text-destructive"
                    : "text-slate-500"
                }`}
              >
                {t("attributeValue")}
              </label>

              <div className="mt-1">
                {(() => {
                  const config = attributeValueConfig[attr.key] ?? {
                    type: "text",
                  };

                  switch (config.type) {
                    case "select":
                      return (
                        <Select
                          value={attr.value}
                          onValueChange={(value) =>
                            updateAttribute(
                              variantIndex,
                              attrIndex,
                              "value",
                              value,
                            )
                          }
                          disabled={isDisabled}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue
                              placeholder={t("placeholders.selectValue")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {config.options?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );

                    case "color":
                      return (
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={attr.value || "#000000"}
                            onChange={(e) =>
                              updateAttribute(
                                variantIndex,
                                attrIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10 p-1"
                            disabled={isDisabled}
                          />
                          <Input
                            value={attr.value}
                            onChange={(e) =>
                              updateAttribute(
                                variantIndex,
                                attrIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder={t("placeholders.colorValue")}
                          />
                        </div>
                      );

                    default:
                      return (
                        <Input
                          value={attr.value}
                          onChange={(e) =>
                            updateAttribute(
                              variantIndex,
                              attrIndex,
                              "value",
                              e.target.value,
                            )
                          }
                          className="bg-white"
                          placeholder={t("placeholders.enterValue")}
                          disabled={isDisabled}
                        />
                      );
                  }
                })()}
              </div>

              {/* Always-rendered error slot — prevents layout shift */}
              <p className="text-sm font-medium text-destructive min-h-[20px] mt-1">
                {(getAttributeError(
                  variantIndex,
                  attrIndex,
                  "value",
                ) as string) || ""}
              </p>
            </div>

            {/* Remove button — aligned to the top of the row, offset to clear the label */}
            {variant?.attributes?.length > 1 && (
              <div className="pt-[18px] shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-destructive h-10 w-10"
                  onClick={() => removeAttribute(variantIndex, attrIndex)}
                  disabled={isDisabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductVariantAttributesSection);
