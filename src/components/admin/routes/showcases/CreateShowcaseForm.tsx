"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar24 } from "@/components/shared/Calendar24";
import { useShowcases } from "@/contexts/Showcase.context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveTypeHintConfigsQuery } from "@/hooks/react-query/useTypeHintConfigsQuery";
import RequestingDataLoader from "@/components/shared/RequestingDataLoader";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string,
  activeTypeHintConfigsList: string[]
) => {
  const {
    titleMinChars,
    titleMaxChars,
    descMinChars,
    descMaxChars,
    linkMinChars,
    linkBtnTextMaxChars,
    linkBtnTextMinChars,
    linkMaxChars,
  } = validationConfig.showcase;

  return z
    .object({
      title_ar: z
        .string()
        .min(titleMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_ar.minChars",
            { min: titleMinChars }
          ),
        })
        .max(titleMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_ar.maxChars",
            { max: titleMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_ar.arabicCharsOnly"
          ),
        }),
      title_en: z
        .string()
        .min(titleMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_en.minChars",
            { min: titleMinChars }
          ),
        })
        .max(titleMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_en.maxChars",
            { max: titleMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.title_en.englishCharsOnly"
          ),
        }),
      description_ar: z
        .string()
        .min(descMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_ar.minChars",
            { min: descMinChars }
          ),
        })
        .max(descMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_ar.maxChars",
            { max: descMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_ar.arabicCharsOnly"
          ),
        }),
      description_en: z
        .string()
        .min(descMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_en.minChars",
            { min: descMinChars }
          ),
        })
        .max(descMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_en.maxChars",
            { max: descMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.description_en.englishCharsOnly"
          ),
        }),
      showAllButtonText_ar: z
        .string()
        .min(linkBtnTextMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_ar.minChars",
            { min: linkBtnTextMinChars }
          ),
        })
        .max(linkBtnTextMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_ar.maxChars",
            { max: linkBtnTextMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_ar.arabicCharsOnly"
          ),
        }),
      showAllButtonText_en: z
        .string()
        .min(linkBtnTextMinChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_en.minChars",
            { min: linkBtnTextMinChars }
          ),
        })
        .max(linkBtnTextMaxChars, {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_en.maxChars",
            { max: linkBtnTextMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonText_en.englishCharsOnly"
          ),
        }),
      showAllButtonLink: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true; // optional: allow empty
            return val.length >= linkMinChars;
          },
          {
            message: t(
              "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonLink.minChars",
              { min: linkMinChars }
            ),
          }
        )
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true;
            return val.length <= linkMaxChars;
          },
          {
            message: t(
              "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonLink.maxChars",
              { max: linkMaxChars }
            ),
          }
        )
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true;

            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          },
          {
            message: t(
              "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.showAllButtonLink.invalidUrl"
            ),
          }
        ),

      type: z
        .string()
        .refine((val) => activeTypeHintConfigsList.includes(val), {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.type.invalid"
          ),
        }),
      startDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.startDate.invalid"
          ),
        })
        .nullable()
        .optional(),
      endDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.endDate.invalid"
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
              "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.endDate.mustBeAfterStart"
            ),
          });
        }
      }
    });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreateShowcaseForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { accessToken, queryKey } = useShowcases();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();
  const {
    data: activeTypeHintConfigsList = [],
    isLoading: isActiveTypeHintConfigLoading,
    isFetching: isActiveTypeHintConfigFetching,
  } = useActiveTypeHintConfigsQuery();

  const formSchema = createFormSchema(t, activeTypeHintConfigsList);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      showAllButtonText_ar: "عرض الكل",
      showAllButtonText_en: "Show All",
      showAllButtonLink: "",
      type: "",
      startDate: null,
      endDate: null,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(API_ENDPOINTS.DASHBOARD.SHOWCASES.CREATE, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          showAllButtonLink: `/search?typeHint=${data.type}`,
          lang: locale,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData?.message ||
            t("routes.dashboard.routes.showcases.errors.failedCreation")
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

  const isFormTypeHintConfigsListLoading =
    (isActiveTypeHintConfigLoading || isActiveTypeHintConfigFetching) &&
    activeTypeHintConfigsList?.length === 0;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Fields */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.title_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.title_ar.placeholder"
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
                name="title_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.title_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.title_en.placeholder"
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

          {/* Description Fields */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.description_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.description_ar.placeholder"
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
                name="description_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.description_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.description_en.placeholder"
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

          {/* Button Text Fields */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="showAllButtonText_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonText_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonText_ar.placeholder"
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
                name="showAllButtonText_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonText_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonText_en.placeholder"
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

          {/* Button Link Field */}
          <FormField
            control={form.control}
            name="showAllButtonLink"
            render={({ field }) => (
              <FormItem className={getFormItemClassName()}>
                <FormLabel className="text-sm font-normal">
                  {t(
                    "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonLink.label"
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    className={getInputClassName()}
                    placeholder={t(
                      "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonLink.placeholder"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-text-primary-100">
                  {t(
                    "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.showAllButtonLink.desc"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.type.label"
                    )}
                  </FormLabel>
                  {isFormTypeHintConfigsListLoading ? (
                    <RequestingDataLoader />
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.type.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeTypeHintConfigsList?.map((th, i) => (
                          <SelectItem
                            key={`TypeHintItem_${i}`}
                            value={th}
                            className="cursor-pointer capitalize"
                          >
                            {th}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Fields */}
          <div className={`flex flex-col gap-5`}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.startDate.label"
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
                      "routes.dashboard.routes.showcases.components.CreateShowcaseForm.fields.endDate.label"
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
            disabled={
              isFormTypeHintConfigsListLoading || registerMutation.isPending
            }
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

export default memo(CreateShowcaseForm);
