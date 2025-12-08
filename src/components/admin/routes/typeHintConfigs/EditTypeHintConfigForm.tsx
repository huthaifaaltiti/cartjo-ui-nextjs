"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccessToast } from "@/components/shared/CustomToast";
import LoadingButton from "@/components/shared/LoadingButton";
import { User } from "@/types/user";
import { invalidateQuery } from "@/utils/queryUtils";
import { validationConfig } from "@/config/validationConfig";
import { isArabicLocale } from "@/config/locales.config";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { isArabicOnly } from "@/utils/text/containsArabic";
import { isEnglishOnly } from "@/utils/text/containsEnglish";
import { isEnglishWithNumOnly } from "@/utils/text/containsEnglish";
import { Calendar24 } from "@/components/shared/Calendar24";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import { staticTypeHintConfigs } from "@/constants/staticTypeHintConfigs.constant";

const editFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const {
    labelMinChars,
    labelMaxChars,
    iconMinChars,
    iconMaxChars,
    clrFromMinChars,
    clrFromMaxChars,
    clrToMinChars,
    clrToMaxChars,
    textClrMinChars,
    textClrMaxChars,
    priorityMinChars,
    priorityMaxChars,
  } = validationConfig.typeHintConfig;

  return z
    .object({
      label_ar: z
        .string()
        .min(labelMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_ar.minChars",
            { min: labelMinChars }
          ),
        })
        .max(labelMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_ar.maxChars",
            { max: labelMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_ar.arabicCharsOnly"
          ),
        }),
      label_en: z
        .string()
        .min(labelMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_en.minChars",
            { min: labelMinChars }
          ),
        })
        .max(labelMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_en.maxChars",
            { max: labelMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.label_en.englishCharsOnly"
          ),
        }),
      icon: z
        .string()
        .min(iconMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.icon.minChars",
            { min: iconMinChars }
          ),
        })
        .max(iconMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.icon.maxChars",
            { max: iconMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.icon.englishCharsOnly"
          ),
        }),
      clrFrom: z
        .string()
        .min(clrFromMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrFrom.minChars",
            { min: clrFromMinChars }
          ),
        })
        .max(clrFromMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrFrom.maxChars",
            { max: clrFromMaxChars }
          ),
        })
        .refine((val) => isEnglishWithNumOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrFrom.englishCharsAndNumOnly"
          ),
        }),
      clrTo: z
        .string()
        .min(clrToMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrTo.minChars",
            { min: clrToMinChars }
          ),
        })
        .max(clrToMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrTo.maxChars",
            { max: clrToMaxChars }
          ),
        })
        .refine((val) => isEnglishWithNumOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.clrTo.englishCharsAndNumOnly"
          ),
        }),
      textClr: z
        .string()
        .min(textClrMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.textClr.minChars",
            { min: textClrMinChars }
          ),
        })
        .max(textClrMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.textClr.maxChars",
            { max: textClrMaxChars }
          ),
        })
        .refine((val) => isEnglishWithNumOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.textClr.englishCharsAndNumOnly"
          ),
        }),
      priority: z
        .number()
        .min(priorityMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.priority.minChars",
            { min: priorityMinChars }
          ),
        })
        .max(priorityMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.priority.maxChars",
            { max: priorityMaxChars }
          ),
        }),
      startDate: z
        .date({
          // required_error: t(
          //   "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.startDate.required"
          // ),
          invalid_type_error: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.startDate.invalid"
          ),
        })
        .nullable()
        .optional(),
      endDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.endDate.invalid"
          ),
        })
        .nullable()
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Validate date order
      if (data.startDate && data.endDate) {
        if (data.endDate <= data.startDate) {
          ctx.addIssue({
            path: ["endDate"],
            code: "custom",
            message: t(
              "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.validations.endDate.mustBeAfterStart"
            ),
          });
        }
      }
    });
};

type FormData = z.infer<ReturnType<typeof editFormSchema>>;

const EditTypeHintConfigForm = ({
  typeHintConfig,
}: {
  typeHintConfig: TypeHintConfig;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { token: accessToken, queryKey } = useTypeHintConfig();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const formSchema = editFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label_ar: typeHintConfig?.label?.ar || "",
      label_en: typeHintConfig?.label?.en || "",
      icon: typeHintConfig?.icon || "Component",
      clrFrom: typeHintConfig?.colorFrom || "622A9B",
      clrTo: typeHintConfig?.colorTo || "ED5353",
      textClr: typeHintConfig?.textColor || "fff",
      priority: typeHintConfig?.priority || 10,
      startDate: typeHintConfig?.startDate || null,
      endDate: typeHintConfig?.endDate || null,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const dataObj = {
        label_ar: data.label_ar,
        label_en: data.label_en,
        icon: data.icon,
        colorFrom: data.clrFrom,
        colorTo: data.clrTo,
        textColor: data.textClr,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        lang: locale,
      };

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.EDIT}/${typeHintConfig?._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...dataObj }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData?.message ||
            t("routes.dashboard.routes.typeHintConfigs.errors.failedCreation")
        );
      }

      return response.json();
    },
    onSuccess: async (data: {
      isSuccess: boolean;
      message: string;
      user: User;
    }) => {
      if (data?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: data.message,
          dismissText: t("general.toast.dismissText"),
        });

        form.reset();

        await invalidateQuery(queryClient, queryKey);
      }
    },
    onError: (error: Error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (values: FormData) => {
    registerMutation.mutate(values);
  };

  const getInputClassName = (baseClasses = "") =>
    `placeholder:text-xs text-xs ${baseClasses} ${
      isArabic
        ? "placeholder:text-right text-right"
        : "placeholder:text-left text-left"
    }`;

  const getFormItemClassName = () => (isArabic ? "text-right" : "text-left");

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Label fields */}
          <div className="flex gap-5 rtl:flex-row-reverse ltr:flex-row">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="label_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.label_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.label_ar.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="label_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.label_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={staticTypeHintConfigs.includes(
                          field.value.split(" ").join("-")
                        )}
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.label_en.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Icon name field */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.icon.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={getInputClassName()}
                      placeholder={t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.icon.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-text-primary-400">
                    <span>
                      <span> 🌟 </span>
                      <span>
                        {t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.icon.hint"
                        )}
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Color codes fields */}
          <div className="flex gap-5 rtl:flex-row-reverse ltr:flex-row">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="clrFrom"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrFrom.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrFrom.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-text-primary-400">
                      <span>
                        <span> 🌟 </span>
                        <span>
                          {t(
                            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrFrom.hint"
                          )}
                        </span>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="clrTo"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrTo.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrTo.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-text-primary-400">
                      <span>
                        <span> 🌟 </span>
                        <span>
                          {t(
                            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.clrTo.hint"
                          )}
                        </span>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="textClr"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.textClr.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.textClr.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-text-primary-400">
                      <span>
                        <span> 🌟 </span>
                        <span>
                          {t(
                            "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.textClr.hint"
                          )}
                        </span>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.priority.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      inputMode="numeric"
                      step="1"
                      className={getInputClassName()}
                      placeholder={t(
                        "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.priority.placeholder"
                      )}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only integers
                        const intValue = value.replace(/[^0-9]/g, "");
                        // Keep within range 1-10
                        const finalValue =
                          intValue !== ""
                            ? Math.min(10, Math.max(1, parseInt(intValue, 10)))
                            : "";
                        field.onChange(finalValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-text-primary-400">
                    <span>
                      <span> 🌟 </span>
                      <span>
                        {t(
                          "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.priority.hint"
                        )}
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={`flex flex-col gap-5`}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.startDate.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Calendar24 value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.EditTypeHintConfigForm.fields.endDate.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Calendar24 value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <LoadingButton
            type="submit"
            loading={registerMutation.isPending}
            withAnimate={true}
            label={t("general.actions.proceed")}
            loadingLabel={t("general.UploadingStates.uploadingData")}
          />
        </form>
      </Form>
    </div>
  );
};

export default memo(EditTypeHintConfigForm);
