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

const RegisterForm: React.FC = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.register"
  );
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
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, countryCode: "00962", lang: locale }),
      });

      if (!response.ok) {
        const resp = await response.json();

        console.log(resp);

        if (resp?.statusCode === 400) {
          showWarningToast({
            title: resp?.error,
            description: resp?.message,
          });
        }

        // throw new Error("Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      showSuccessToast({
        title: "Success!",
        description: data.message,
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

  const renderInput = (
    name: keyof z.infer<typeof formSchema>,
    labelKey: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={isArabic ? "text-right" : "text-left"}>
          <FormLabel className="text-sm font-normal">
            {t(`dataSet.${labelKey}.label`)}
          </FormLabel>
          <FormControl>
            <Input
              className={`placeholder:text-xs text-xs ${
                isArabic ? "placeholder:text-right" : "placeholder:text-left"
              }`}
              placeholder={t(`dataSet.${labelKey}.placeholder`)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/2">{renderInput("firstName", "firstName")}</div>
          <div className="w-1/2">{renderInput("lastName", "lastName")}</div>
        </div>

        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-1/2">
            {renderInput("phoneNumber", "phoneNumber")}
          </div>
          <div className="w-1/2">{renderInput("email", "email")}</div>
        </div>

        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-full">{renderInput("password", "Password")}</div>
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
        >
          {t("actions.proceed")}
        </Button>
      </form>
    </Form>
  );
};

export default memo(RegisterForm);
