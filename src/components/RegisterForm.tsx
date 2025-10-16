"use client";

import { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { apiRequest } from "@/utils/apiRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useGeneralContext } from "@/contexts/General.context";

const RegisterForm = () => {
  const t = useTranslations();
  const { isArabic, dir, locale } = useGeneralContext();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const preferredLangs = [
    {
      label: t(
        "routes.auth.components.AuthTabs.components.register.dataSet.preferredLang.langs.ar"
      ),
      val: "ar",
    },
    {
      label: t(
        "routes.auth.components.AuthTabs.components.register.dataSet.preferredLang.langs.en"
      ),
      val: "en",
    },
  ];

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: t(
        "routes.auth.components.AuthTabs.components.register.validations.firstName.min"
      ),
    }),
    lastName: z.string().min(2, {
      message: t(
        "routes.auth.components.AuthTabs.components.register.validations.lastName.min"
      ),
    }),
    phoneNumber: z.string().regex(/^7[789]\d{7}$/, {
      message: t(
        "routes.auth.components.AuthTabs.components.register.validations.phoneNumber.pattern"
      ),
    }),
    email: z.string().email({
      message: t(
        "routes.auth.components.AuthTabs.components.register.validations.email.invalid"
      ),
    }),
    password: z.string().min(6, {
      message: t(
        "routes.auth.components.AuthTabs.components.register.validations.password.min"
      ),
    }),
    preferredLang: z.enum(["ar", "en"]),
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: t(
          "routes.auth.components.AuthTabs.components.register.validations.termsAccepted.required"
        ),
      }),
    }),
    marketingEmails: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      preferredLang: "ar",
      termsAccepted: true,
      marketingEmails: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        const response = await apiRequest<{ msg: string }>(
          API_ENDPOINTS.AUTH.REGISTER,
          {
            method: "POST",
            body: JSON.stringify({
              ...data,
              countryCode: "00962",
              lang: locale,
            }),
          }
        );

        return response;
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "status" in error) {
          const err = error as {
            status: number;
            error?: string;
            message?: string;
          };

          if (err.status === 400) {
            showWarningToast({
              title: err.error ?? "Warning",
              description: err.message ?? "Bad Request",
            });
          }

          // Re-throw to trigger onError
          throw new Error(err.message || "Registration failed");
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      showSuccessToast({
        title: t("general.toast.title.success"),
        description: data.msg,
        dismissText: t("general.toast.dismissText"),
      });
    },
    onError: (error: Error) => {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: error.message,
        dismissText: t("general.toast.dismissText"),
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          className={`w-full flex items-center justify-between gap-5 ${
            isArabic ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.firstName.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right text-right"
                          : "placeholder:text-left text-left"
                      }`}
                      placeholder={t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.firstName.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.lastName.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right text-right"
                          : "placeholder:text-left text-left"
                      }`}
                      placeholder={t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.lastName.placeholder"
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

        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.phoneNumber.label"
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
                        "routes.auth.components.AuthTabs.components.register.dataSet.phoneNumber.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.email.label"
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
                        "routes.auth.components.AuthTabs.components.register.dataSet.email.placeholder"
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

        <div className="w-full">
          <div className="w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.password.label"
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
                          "routes.auth.components.AuthTabs.components.register.dataSet.password.placeholder"
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
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full mt-5">
            <FormField
              control={form.control}
              name="preferredLang"
              render={({ field }) => (
                <FormItem dir={dir}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.preferredLang.label"
                    )}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl dir={dir}>
                      <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                        <SelectValue
                          placeholder={t(
                            "routes.dashboard.routes.products.components.CreateProductForm.fields.currency.placeholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {preferredLangs.map((lang, i) => (
                        <SelectItem
                          key={`lang_${i}`}
                          value={lang.val}
                          className="cursor-pointer capitalize"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <p
          className={`w-full text-text-primary-200 text-sm ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {t("routes.auth.components.AuthTabs.components.register.note")}{" "}
          <Link href={"/privacy-policy"} target="_blank">
            <span className="text-primary-500 hover:text-primary-900 hover:underline cursor-pointer">
              {t(
                "routes.auth.components.AuthTabs.components.register.privacyPolicy"
              )}
            </span>
          </Link>
        </p>

        <div
          className={`w-full flex items-center gap-5 ${
            isArabic ? "justify-end" : "justify-start"
          }`}
        >
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem
                dir={dir}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <FormControl className="h-4 mt-2">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="marketingEmails"
                  className="text-sm font-normal"
                >
                  {t(
                    "routes.auth.components.AuthTabs.components.register.dataSet.marketingEmails.label"
                  )}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem
                dir={dir}
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <FormControl className="h-4 mt-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="termsAccepted"
                  className="text-sm font-normal"
                >
                  {t(
                    "routes.auth.components.AuthTabs.components.register.dataSet.termsAccepted.label"
                  )}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 transition-all"
          type="submit"
          disabled={registerMutation?.isPending}
        >
          {registerMutation?.isPending
            ? t("general.loadingStates.loadingApi")
            : t(
                "routes.auth.components.AuthTabs.components.register.actions.proceed"
              )}
        </Button>
      </form>
    </Form>
  );
};

export default memo(RegisterForm);
