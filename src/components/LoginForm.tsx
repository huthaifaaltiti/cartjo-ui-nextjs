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
import { useVerifyEmail } from "@/contexts/VerifyEmailContext";
import ForgotPasswordLink from "./user/auth/forgot-password/ForgotPasswordLink";
import LoadingButton from "./shared/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { login } from "@/redux/slices/authorization/login/actions";
import { resetLoginState } from "@/redux/slices/authorization/login";

const LoginForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const dir = isArabic ? "rtl" : "ltr";

  const dispatch = useDispatch<AppDispatch>();
  const {
    status: loginStatus,
    token,
    message,
    isLoading,
  } = useSelector((state: RootState) => state.login);

  const router = useRouter();

  const { data: sessionData, status } = useSession();
  const { reVerify } = useVerifyEmail();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleHandled, setGoogleHandled] = useState(false);

  const [resend] = useQueryState("resend", {
    defaultValue: false,
    parse: (value) => Boolean(value),
  });
  const [identifier] = useQueryState("identifier", {
    defaultValue: "",
    parse: (value) => String(value),
  });
  const [redirectTo] = useQueryState("redirectTo", {
    defaultValue: "",
    parse: (value) => String(value),
  });
  const [authToken] = useQueryState("authToken", {
    defaultValue: "",
    parse: (value) => String(value),
  });
  const [authError] = useQueryState("authError", {
    defaultValue: "",
  });

  const authErrorMessages: Record<string, string> = {
    GOOGLE_NO_CODE: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.noCode",
    ),
    GOOGLE_EMAIL_MISSING: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.emailMissing",
    ),
    GOOGLE_AUTH_FAILED: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.failed",
    ),
  };

  useEffect(() => {
    if (!authError) return;

    showErrorToast({
      title: t("general.toast.title.error"),
      description:
        authErrorMessages[authError] || t("general.toast.defaultError"),
      dismissText: t("general.toast.dismissText"),
    });

    // clean URL
    router.replace("/auth", { scroll: false });
  }, [authError, router, t]);

  useEffect(() => {
    if (!authToken || googleHandled) return;

    setGoogleHandled(true);

    signIn("credentials", {
      token: authToken,
      redirect: false,
    }).then((res) => {
      if (res?.ok) {
        router.replace(redirectTo || "/");

        showSuccessToast({
          title: t("general.toast.title.success"),
          description: t(
            "routes.auth.components.AuthTabs.components.login.api.loginSuccess",
          ),
          dismissText: t("general.toast.dismissText"),
        });
      } else {
        router.replace("/auth?error=google_login_failed");
      }
    });
  }, [authToken, googleHandled, redirectTo, router]);

  useEffect(() => {
    dispatch(resetLoginState());

    if (loginStatus === "success" && token) {
      showSuccessToast({
        title: t("general.toast.title.success"),
        description: message,
        dismissText: t("general.toast.dismissText"),
      });

      // Sign/NextAuth
      signIn("credentials", { token, redirect: false }).then((res) => {
        if (res?.ok) {
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
      });

      dispatch(resetLoginState());
    }

    if (loginStatus === "error") {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: message,
        dismissText: t("general.toast.dismissText"),
      });
    }
  }, [loginStatus, token, message]);

  useEffect(() => {
    if (status === "authenticated") {
      if (resend && sessionData?.user?.email) {
        reVerify(sessionData.user.email, locale)
          .then(() => redirectTo && router.push(redirectTo))
          .catch(console.error);
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [status, resend, sessionData, locale, router, redirectTo, reVerify]);

  const formSchema = z.object({
    identifier: z
      .string()
      .min(3, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.min",
        ),
      })
      .max(50, {
        message: t(
          "routes.auth.components.AuthTabs.components.login.validations.identifier.max",
        ),
      })
      .refine(
        (val) =>
          /^[a-zA-Z0-9._]{2,50}$/.test(val) || // username pattern
          /^7[789]\d{7}$/.test(val) || // Jordanian mobile pattern
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), // email pattern
        {
          message: t(
            "routes.auth.components.AuthTabs.components.login.validations.identifier.pattern",
          ),
        },
      ),
    password: z.string().min(6, {
      message: t(
        "routes.auth.components.AuthTabs.components.login.validations.password.min",
      ),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: identifier ?? "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await dispatch(login({ ...data, lang: locale }));
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        dir={dir}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* identifier */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className={`${isArabic ? "text-right" : "text-left"}`}>
              <FormLabel className={"text-sm font-normal"}>
                {t(
                  "routes.auth.components.AuthTabs.components.login.dataSet.username.label",
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
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={`${isArabic ? "text-right" : "text-left"}`}>
                <FormLabel className="text-sm text-text-primary-400 font-normal">
                  {t(
                    "routes.auth.components.AuthTabs.components.login.dataSet.password.label",
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      dir="ltr"
                      type={showPassword ? "text" : "password"}
                      className={`placeholder:text-xs text-xs`}
                      placeholder={t(
                        "routes.auth.components.AuthTabs.components.login.dataSet.password.placeholder",
                      )}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`absolute inset-y-0 right-2 flex items-center text-gray-500`}
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
          loading={(loginMutation?.isPending || isLoading) ?? false}
          withAnimate={true}
          dir={dir}
          label={t(
            "routes.auth.components.AuthTabs.components.login.actions.proceed",
          )}
          loadingLabel={t(
            "routes.auth.components.AuthTabs.components.login.actions.proceed",
          )}
        />
      </form>
    </Form>
  );
};

export default memo(LoginForm);
