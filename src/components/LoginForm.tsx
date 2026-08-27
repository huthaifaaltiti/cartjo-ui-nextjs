"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { isArabicLocale } from "@/config/locales.config";
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
import { showErrorToast, showSuccessToast } from "./shared/CustomToast";
import { useQueryState } from "nuqs";
import ForgotPasswordLink from "./user/auth/forgot-password/ForgotPasswordLink";
import LoadingButton from "./shared/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { login } from "@/redux/slices/authorization/login/actions";
import { resetLoginState } from "@/redux/slices/authorization/login";
import { COUNTRY_CONFIGS } from "@/config/countryPhone.config";
import {
  isPhoneNumberLike,
  normalizePhoneNumber,
} from "@/utils/normalizePhoneNumber";
import { validationConfig } from "@/config/validationConfig";
import { setSession } from "@/redux/slices/authentication";
import { UserRole } from "@/enums/user-role.enum";

const createFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    identifier: z
      .string()
      .min(1, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.required",
        ),
      })
      .trim()
      .min(validationConfig.auth.identifier.min, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.min",
          { min: validationConfig.auth.identifier.min },
        ),
      })
      .max(validationConfig.auth.identifier.max, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.max",
          { max: validationConfig.auth.identifier.max },
        ),
      })
      .refine(
        (val) =>
          /^[a-zA-Z0-9._]{2,50}$/.test(val) ||
          /^((\+962|00962|0)?7[789]\d{7})$/.test(val) ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        {
          message: t(
            "routes.auth.components.AuthTabs.components.login.validations.identifier.pattern",
          ),
        },
      ),
    password: z
      .string()
      .min(1, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.password.required",
        ),
      })
      .trim()
      .min(validationConfig.auth.password.min, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.password.min",
          { min: validationConfig.auth.password.min },
        ),
      })
      .max(validationConfig.auth.password.max, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.password.max",
          { max: validationConfig.auth.password.max },
        ),
      }),
  });

const LoginForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const dir = isArabic ? "rtl" : "ltr";

  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const dispatch = useDispatch<AppDispatch>();
  const {
    status: loginStatus,
    loggedInSession,
    message,
    isLoading,
  } = useSelector((state: RootState) => state.login);

  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [redirectTo] = useQueryState("redirectTo", {
    defaultValue: "",
    parse: (value) => String(value),
  });
  const [identifier] = useQueryState("identifier", {
    defaultValue: "",
    parse: (value) => String(value),
  });

  // Cleanup on mount/unmount
  useEffect(() => {
    dispatch(resetLoginState());
    return () => {
      dispatch(resetLoginState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!!loggedInSession) {
      dispatch(setSession(loggedInSession));

      showSuccessToast({
        title: t("general.toast.title.success"),
        description: message ?? "",
        dismissText: t("general.toast.dismissText"),
      });

      // Tokens are in HttpOnly cookies — just navigate
      if (redirectTo) {
        router.push(decodeURIComponent(redirectTo));
      } else if (loggedInSession.role === UserRole.CREATOR) {
        router.push("/creators/dashboard");
      } else {
        router.push("/");
      }

      // Refresh server components so they pick up the new cookies
      router.refresh();
    }

    if (loginStatus === "error") {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: message ?? "Login failed",
        dismissText: t("general.toast.dismissText"),
      });
    }
  }, [dispatch, redirectTo, router, t, loginStatus, loggedInSession, message]);

  const defaultValues = useMemo(
    () => ({
      identifier: identifier ?? "",
      password: "",
    }),
    [identifier],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Normalize phone before sending
    const normalizedIdentifier = isPhoneNumberLike(
      values.identifier,
      COUNTRY_CONFIGS.JO,
    )
      ? normalizePhoneNumber(values.identifier, COUNTRY_CONFIGS.JO)
      : values.identifier;

    await dispatch(
      login({ ...values, identifier: normalizedIdentifier, lang: locale }),
    );
  };

  return (
    <Form {...form}>
      <form
        dir={dir}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Identifier */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className={isArabic ? "text-right" : "text-left"}>
              <FormLabel className="text-sm font-normal">
                {t(
                  "routes.auth.components.AuthTabs.components.login.dataSet.username.label",
                )}
              </FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  autoComplete="username"
                  className={`placeholder:text-xs text-xs ${
                    isArabic
                      ? "placeholder:text-right"
                      : "placeholder:text-left"
                  }`}
                  placeholder={t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.username.placeholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-text-primary-100">
                {t(
                  "routes.auth.components.AuthTabs.components.login.dataSet.username.desc",
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col gap-3">
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={isArabic ? "text-right" : "text-left"}>
                <FormLabel className="text-sm font-normal">
                  {t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.password.label",
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      autoComplete="current-password"
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      className={`placeholder:text-xs text-xs pr-10 ${
                        isArabic
                          ? "placeholder:text-right"
                          : "placeholder:text-left"
                      }`}
                      placeholder={t(
                        "routes.auth.components.AuthTabs.components.login.dataSet.password.placeholder",
                      )}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500 pl-2 border-l"
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

        <LoadingButton
          type="submit"
          loading={isLoading ?? false}
          withAnimate={true}
          dir={dir}
          label={t(
            "routes.auth.components.AuthTabs.components.login.actions.proceed",
          )}
          loadingLabel={t(
            "routes.auth.components.AuthTabs.components.login.actions.proceeding",
          )}
        />
      </form>
    </Form>
  );
};

export default memo(LoginForm);
