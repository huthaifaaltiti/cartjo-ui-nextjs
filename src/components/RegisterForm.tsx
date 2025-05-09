import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { apiRequest } from "@/utils/apiRequest";

const RegisterForm: React.FC = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.register"
  );
  const tg = useTranslations("general");
  const v = useTranslations(
    "routes.auth.components.AuthTabs.components.register.validations"
  );

  const formSchema = z.object({
    firstName: z.string().min(2, { message: v("firstName.min") }),
    lastName: z.string().min(2, { message: v("lastName.min") }),
    phoneNumber: z
      .string()
      .regex(/^7[789]\d{7}$/, { message: v("phoneNumber.pattern") }),
    email: z.string().email({ message: v("email.invalid") }),
    password: z.string().min(6, { message: v("password.min") }),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: v("termsAccepted.required") }),
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
        title: "Success!",
        description: data.msg,
      });
    },
    onError: (error: Error) => {
      showErrorToast({
        title: "Error!",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t("dataSet.firstName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t("dataSet.firstName.placeholder")}
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
                    {t("dataSet.lastName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t("dataSet.lastName.placeholder")}
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
                    {t("dataSet.phoneNumber.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t("dataSet.phoneNumber.placeholder")}
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
                    {t("dataSet.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t("dataSet.email.placeholder")}
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
          <div className="w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal">
                    {t("dataSet.password.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className={`placeholder:text-xs text-xs ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t("dataSet.password.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <p className="w-full text-center text-text-primary-200 text-sm">
          {t("note")}{" "}
          <span className="text-primary-500 hover:text-primary-900 cursor-pointer">
            {t("privacyPolicy")}
          </span>
        </p>

        <div className="w-full flex items-center gap-5">
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
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
                  {t("dataSet.termsAccepted.label")}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
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
                  {t("dataSet.marketingEmails.label")}
                </FormLabel>
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
            ? tg("loadingStates.loadingApi")
            : t("actions.proceed")}
        </Button>
      </form>
    </Form>
  );
};

export default memo(RegisterForm);
