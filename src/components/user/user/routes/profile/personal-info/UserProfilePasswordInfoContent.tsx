"use client";

import { memo, useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGeneralContext } from "@/contexts/General.context";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import PasswordRules from "@/components/user/PasswordRules";
import ForgotPasswordLink from "@/components/user/auth/forgot-password/ForgotPasswordLink";

const UserProfilePasswordInfoContent = () => {
  const t = useTranslations(
    "routes.user.layout.routes.profile.components.UserProfilePasswordInfoContent",
  );
  const { isArabic, locale } = useGeneralContext();
  const { setPasswordInfo } = useUserProfileContext();

  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const passwordSchema = z
    .object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      const { currentPassword, newPassword, confirmPassword } = data;

      if (!currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validations.currentPassword.required"),
          path: ["currentPassword"],
        });
      }

      if (!newPassword || !isPasswordValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validations.newPassword.required"),
          path: ["newPassword"],
        });
      }

      if (newPassword !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validations.newPassword.doesNotMatch"),
          path: ["newPassword"],
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validations.confirmPassword.doesNotMatch"),
          path: ["confirmPassword"],
        });
      }
    });

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { trigger, getValues } = form;

  useEffect(() => {
    setPasswordInfo({
      trigger: trigger,
      getValues: getValues,
    });
  }, [form, setPasswordInfo]);

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-5">
        {/* currentPassword */}
        <div className="w-full min-w-[200px]">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className={isArabic ? "text-right" : "text-left"}>
                <FormLabel className="text-sm font-normal text-gray-600">
                  {t("dataSet.currentPassword.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className={`placeholder:text-xs text-xs text-gray-600 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    placeholder={t("dataSet.currentPassword.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* newPassword */}
        <div className="w-full min-w-[200px]">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className={isArabic ? "text-right" : "text-left"}>
                <FormLabel className="text-sm font-normal text-gray-600">
                  {t("dataSet.newPassword.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className={`placeholder:text-xs text-xs text-gray-600 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    placeholder={t("dataSet.newPassword.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PAssword calculator */}
          {form.watch("newPassword").length > 0 && (
            <PasswordRules
              password={form.watch("newPassword")}
              onValidChange={setIsPasswordValid}
            />
          )}
        </div>

        {/* confirmPassword */}
        <div className="w-full min-w-[200px]">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className={isArabic ? "text-right" : "text-left"}>
                <FormLabel className="text-sm font-normal text-gray-600">
                  {t("dataSet.confirmPassword.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className={`placeholder:text-xs text-xs text-gray-600 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    placeholder={t("dataSet.confirmPassword.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ForgotPasswordLink locale={locale} />
      </div>
    </Form>
  );
};

export default memo(UserProfilePasswordInfoContent);
