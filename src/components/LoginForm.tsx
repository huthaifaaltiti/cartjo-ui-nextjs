"use client";

import { memo, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { isArabicLocale } from "@/config/locales.config";
import { Button } from "@/components/ui/button";
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
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "./shared/CustomToast";
import { useQueryState } from "nuqs";
import { useVerifyEmail } from "@/contexts/VerifyEmailContext";
import ForgotPasswordLink from "./user/auth/forgot-password/ForgotPasswordLink";

const LoginForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { reVerify } = useVerifyEmail();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [resend] = useQueryState("resend", {
    defaultValue: false,
    parse: (value) => Boolean(value),
  });
  const [redirectTo] = useQueryState("redirectTo", {
    defaultValue: "",
    parse: (value) => String(value),
  });

  useEffect(() => {
    if (status === "authenticated" && resend && sessionData?.user?.email) {
      reVerify(sessionData.user.email, locale)
        .then(() => {
          if (redirectTo) router.push(redirectTo);
        })
        .catch((err) => console.error("Auto resend failed", err));
    }
  }, [status, resend, sessionData, locale, router, redirectTo, reVerify]);

  const formSchema = z.object({
    identifier: z
      .string()
      .min(3, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.min"
        ),
      })
      .max(50, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.max"
        ),
      })
      .refine(
        (val) =>
          /^[a-zA-Z0-9._]{2,50}$/.test(val) || // username pattern
          /^7[789]\d{7}$/.test(val) || // Jordanian mobile pattern
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), // email pattern
        {
          message: t(
            "routes.auth.components.AuthTabs.components.login.validations.identifier.pattern"
          ),
        }
      ),
    password: z.string().min(6, {
      message: t(
        "routes.auth.components.AuthTabs.components.login.validations.password.min"
      ),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang: locale }),
      });

      if (!response.ok) {
        const resp = await response.json();

        if (!resp?.isSuccess && resp?.statusCode === 400) {
          const messages = resp?.details;

          messages?.forEach(
            (message: { property: string; message: string }) => {
              showWarningToast({
                title: message?.property || t("general.toast.title.warning"),
                description: message?.message,
                dismissText: t("general.toast.dismissText"),
              });
            }
          );

          return Promise.reject();
        }

        if (!resp?.isSuccess && resp?.statusCode === 500) {
          const { message } = resp;

          showErrorToast({
            title: t("general.toast.title.error"),
            description: message,
            dismissText: t("general.toast.dismissText"),
          });

          return Promise.reject();
        }
      }

      return response.json();
    },
    onSuccess: async (data) => {
      const { message, token } = data;

      showSuccessToast({
        title: t("general.toast.title.success"),
        description: message,
        dismissText: t("general.toast.dismissText"),
      });

      if (token) {
        // document.cookie = `auth_token=${token}; path=/`;
        // // document.cookie = `auth_token=${token}; path=/ Secure; HttpOnly; SameSite=Strict`;

        // router.push("/");

        // Sign in with NextAuth using the custom credentials provider
        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (result?.ok) {
          if (resend && redirectTo) {
            router.push(redirectTo);
          } else {
            router.push("/");
          }
        } else {
          showErrorToast({
            title: t("general.toast.title.error"),
            description: "Failed to sign in with token",
            dismissText: t("general.toast.dismissText"),
          });
        }
      }
    },
    onError: (error: Error) => {
      if (!error) return;

      const { message } = error;

      showErrorToast({
        title: t("general.toast.title.error"),
        description: message,
        dismissText: t("general.toast.dismissText"),
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* identifier */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className={`${isArabic ? "text-right" : "text-left"}`}>
              <FormLabel className={"text-sm font-normal"}>
                {t(
                  "routes.auth.components.AuthTabs.components.login.dataSet.username.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  className={`placeholder:text-xs text-xs ${
                    isArabic
                      ? "placeholder:text-right"
                      : "placeholder:text-left"
                  }`}
                  placeholder={t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.username.placeholder"
                  )}
                  {...field}
                />
              </FormControl>

              <FormDescription className="text-xs text-text-primary-100">
                {t(
                  "routes.auth.components.AuthTabs.components.login.dataSet.username.desc"
                )}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col gap-3">
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={`${isArabic ? "text-right" : "text-left"}`}>
                <FormLabel className="text-sm text-text-primary-400 font-normal">
                  {t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.password.label"
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className={`placeholder:text-xs text-xs  ${
                        isArabic
                          ? "placeholder:text-right pl-10"
                          : "placeholder:text-left pr-10"
                      }`}
                      placeholder={t(
                        "routes.auth.components.AuthTabs.components.login.dataSet.password.placeholder"
                      )}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`absolute inset-y-0 ${
                        isArabic ? "left-2" : "right-2"
                      } flex items-center text-gray-500`}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <ForgotPasswordLink locale={locale} />
        </div>

        <Button
          className="w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 transition-all"
          type="submit"
          disabled={loginMutation?.isPending}
        >
          {loginMutation?.isPending
            ? t("general.loadingStates.loadingApi")
            : t(
                "routes.auth.components.AuthTabs.components.login.actions.proceed"
              )}
        </Button>
      </form>
    </Form>
  );
};

export default memo(LoginForm);
