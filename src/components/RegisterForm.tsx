"use client";

import { memo, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { apiRequest } from "@/utils/apiRequest";
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
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PasswordRules from "./user/PasswordRules";
import TwoColumnFormFields from "./shared/TwoColumnFormFields";
import GeneralCheckbox from "./shared/GeneralCheckbox";
import LoadingButton from "./shared/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const RegisterForm = () => {
  const t = useTranslations();
  const { isArabic, locale, dir } = useSelector(
    (state: RootState) => state.general
  );

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showRules, setShowRules] = useState(false);

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
    if (!isPasswordValid) return;

    registerMutation.mutate(values);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        const passwordValue = value?.password || "";
        setShowRules(passwordValue.length > 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form
        dir={dir}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* FirstName & LastName */}
        <div className="w-full">
          <TwoColumnFormFields
            dir={dir}
            leftField={
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
                  </FormItem>
                )}
              />
            }
            rightField={
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
                  </FormItem>
                )}
              />
            }
            leftError={form.formState.errors.firstName?.message}
            rightError={form.formState.errors.lastName?.message}
          />
        </div>

        {/* Phone number & email */}
        <div className="w-full">
          <TwoColumnFormFields
            dir={dir}
            leftField={
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
                  </FormItem>
                )}
              />
            }
            rightField={
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
                  </FormItem>
                )}
              />
            }
            leftError={form.formState.errors.phoneNumber?.message}
            rightError={form.formState.errors.email?.message}
          />
        </div>

        {/* Password & PreferredLanguage */}
        <div className="w-full">
          {/* password */}
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
                        className={`placeholder:text-xs text-xs ${
                          isArabic
                            ? "placeholder:text-right pl-10 text-right"
                            : "placeholder:text-left pr-10 text-left"
                        }`}
                        placeholder={t(
                          "routes.auth.components.AuthTabs.components.register.dataSet.password.placeholder"
                        )}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // re-trigger PasswordRules validation on input change
                          setIsPasswordValid(false);
                        }}
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

                  {showRules && (
                    <PasswordRules
                      password={form.watch("password")}
                      onValidChange={setIsPasswordValid}
                    />
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* preferredLang */}
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
                            "routes.auth.components.AuthTabs.components.register.dataSet.preferredLang.placeholder"
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
                  <FormDescription className="text-xs text-text-primary-100">
                    {t(
                      "routes.auth.components.AuthTabs.components.register.dataSet.preferredLang.desc"
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Hint */}
        <div>
          <p
            className={`w-full rtl:text-right ltr:text-left  text-text-primary-200 text-sm`}
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
        </div>

        {/* marketingEmails & termsAccepted */}
        <div className="w-full">
          <TwoColumnFormFields
            dir={dir}
            rightField={
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem dir={dir} className="flex items-center gap-2">
                    <FormControl>
                      <GeneralCheckbox
                        id="termsAccepted"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="w-auto flex flex-col gap-1">
                      <FormLabel
                        htmlFor="termsAccepted"
                        className="text-sm font-normal"
                      >
                        {t(
                          "routes.auth.components.AuthTabs.components.register.dataSet.termsAccepted.label"
                        )}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            }
            leftField={
              <FormField
                control={form.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem dir={dir} className="flex items-center gap-2">
                    <FormControl className="h-4 mt-2">
                      <GeneralCheckbox
                        id="marketingEmails"
                        checked={field.value ?? false}
                        onChange={field.onChange}
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
            }
            rightError={form.formState.errors.termsAccepted?.message}
            leftError={form.formState.errors.marketingEmails?.message}
          />
        </div>

        <LoadingButton
          type="submit"
          loading={registerMutation?.isPending}
          withAnimate={true}
          dir={dir}
          label={t(
            "routes.auth.components.AuthTabs.components.register.actions.proceed"
          )}
          loadingLabel={t("general.loadingStates.loadingApi")}
        />
      </form>
    </Form>
  );
};

export default memo(RegisterForm);
