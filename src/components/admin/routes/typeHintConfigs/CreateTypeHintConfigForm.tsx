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
import { Calendar24 } from "@/components/shared/Calendar24";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const { labelMinChars, labelMaxChars, priorityMinChars, priorityMaxChars } =
    validationConfig.typeHintConfig;

  return z
    .object({
      label_ar: z
        .string()
        .min(labelMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_ar.minChars",
            { min: labelMinChars }
          ),
        })
        .max(labelMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_ar.maxChars",
            { max: labelMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_ar.arabicCharsOnly"
          ),
        }),
      label_en: z
        .string()
        .min(labelMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_en.minChars",
            { min: labelMinChars }
          ),
        })
        .max(labelMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_en.maxChars",
            { max: labelMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.label_en.englishCharsOnly"
          ),
        }),
      priority: z
        .number()
        .min(priorityMinChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.priority.minChars",
            { min: priorityMinChars }
          ),
        })
        .max(priorityMaxChars, {
          message: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.priority.maxChars",
            { max: priorityMaxChars }
          ),
        }),
      startDate: z
        .date({
          // required_error: t(
          //   "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.startDate.required"
          // ),
          invalid_type_error: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.startDate.invalid"
          ),
        })
        .nullable()
        .optional(),
      endDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.endDate.invalid"
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
              "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.validations.endDate.mustBeAfterStart"
            ),
          });
        }
      }
    });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreateTypeHintConfigForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { token: accessToken, queryKey } = useTypeHintConfig();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label_ar: "",
      label_en: "",
      priority: 10,
      startDate: null,
      endDate: null,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const dataObj = {
        label_ar: data.label_ar,
        label_en: data.label_en,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        lang: locale,
      };

      const response = await fetch(
        API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.CREATE,
        {
          method: "POST",
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
                        "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.label_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.label_ar.placeholder"
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
                        "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.label_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.label_en.placeholder"
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

          {/* Priority */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.priority.label"
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
                        "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.priority.placeholder"
                      )}
                      {...field}
                      onChange={(e) => {
                        /*Thought for 8s

Here’s a deep, line-by-line walkthrough of that onChange handler. I’ll expand what each token does, what types are involved, and why it’s written this way.

onChange={(e) => {


Sets the input’s onChange prop to an inline arrow function.

e is the change event object. In React + TS you can think of it as React.ChangeEvent<HTMLInputElement>.

React calls this function every time the input’s value changes (typing, paste, clear, etc.).

  const value = e.target.value;


e.target is the input element that fired the event.

.value is always a string in the DOM, even when type="number".

We store it in value so we can process it.

  const intValue = value.replace(/[^0-9]/g, "");


String.prototype.replace runs a regex to scrub the string.

Regex /[^0-9]/g means:

[...] → character class.

^ (inside the class) → negation.

0-9 → any ASCII digit.

So [^0-9] = any character that is not a digit.

g flag → replace all occurrences, not just the first.

Result: remove everything except digits.

This strips -, +, ., ,, e, spaces, emojis, Arabic numerals, etc.

Example:

"12.3" → "123"

"-5" → "5"

"abc" → "" (empty)

Note: leading zeros survive here (e.g., "007" → "007"). They get handled by parseInt later.

  // Keep within range 1-10


A comment to explain the next line: we’re about to clamp to [1, 10].

  const finalValue =
    intValue !== ""
      ? Math.min(10, Math.max(1, parseInt(intValue, 10)))
      : "";


This is a conditional (ternary) expression that yields either a number or an empty string:

intValue !== "" checks whether we still have at least one digit after sanitizing.

If true: we compute a clamped integer.

If false: we return "" (empty string) to let the input render as empty (useful when user deletes everything).

Inside the true branch:

parseInt(intValue, 10) converts the digit string to a base-10 integer.

"007" → 7; "0" → 0; "123" → 123.

Because we already stripped non-digits, parseInt won’t produce NaN unless the string were empty (handled by the ternary).

Math.max(1, parsed) enforces a lower bound of 1.

0 → 1, -5 (can’t happen now) would → 1.

Math.min(10, ...) enforces an upper bound of 10.

11 → 10, 999 → 10.

So the overall result:

If there are digits → a Number in the inclusive range [1, 10].

If the user cleared the field → "" (keeps the controlled input empty without forcing a number).

  field.onChange(finalValue);


Calls your form controller’s change handler (e.g., from React Hook Form).

We pass the sanitized value instead of the raw event:

It will be either a number (1–10) or "" (empty).

Why not pass the event? Because we’ve already normalized the value; giving the event would reintroduce raw user input.

React controlled input note: an <input type="number" /> can accept a string or number as its value. Passing "" is the correct way to show an empty field.

}}


Closes the function and the prop.

Edge cases & behavior summary

Typing . / - / + / e is immediately stripped out.

Pasting 999 becomes 10.

Entering 0 becomes 1.

Entering 007 becomes 7.

Clearing the field sets it to "" (blank), not 0.

Works for both typing and pasting; no need to intercept keydown events.

If you want, I can show a variant that also blocks unwanted keys at the keystroke level (onKeyDown) in addition to this post-processing, but the above is typically enough and is friendlier to IME/clipboard input.*/
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
                          "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.priority.hint"
                        )}
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dates */}
          <div className={`flex flex-col gap-5`}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.startDate.label"
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
                      "routes.dashboard.routes.typeHintConfigs.components.CreateTypeHintConfigForm.fields.endDate.label"
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

export default memo(CreateTypeHintConfigForm);
