"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "./shared/CustomToast";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

const LoginForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";

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
                title: message?.property,
                description: message?.message,
              });
            }
          );
        }

        throw new Error("Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      const { message } = data;

      showSuccessToast({
        title: "Success!",
        description: message,
      });
    },
    onError: (error: Error) => {
      const { message } = error;

      showErrorToast({
        title: "Error!",
        description: message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input
                  className={`placeholder:text-xs text-xs ${
                    isArabic
                      ? "placeholder:text-right"
                      : "placeholder:text-left"
                  }`}
                  placeholder={t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.password.placeholder"
                  )}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 transition-all"
          type="submit"
        >
          {t(
            "routes.auth.components.AuthTabs.components.login.actions.proceed"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default memo(LoginForm);
