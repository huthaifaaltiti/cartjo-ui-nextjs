"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ImagePlus } from "lucide-react";

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
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";

import { User } from "@/types/user";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/handleApiError";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
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
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message: t(
          "routes.auth.components.AuthTabs.components.register.validations.termsAccepted.required"
        ),
      }),
    }),
    marketingEmails: z.boolean().optional(),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface EditAdminUserFormProps {
  accessToken: string;
  user: User;
}

const EditAdminUserForm = ({ accessToken, user }: EditAdminUserFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const handleApiError = useHandleApiError();

  const imgInputRef = useRef<HTMLInputElement>(null);

  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      password: "",
      termsAccepted: user?.termsAccepted || true,
      marketingEmails: user?.marketingEmails || false,
    },
  });

  const handleImageSelect = () => {
    imgInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      showWarningToast({
        title: t("general.toast.title.warn"),
        description: "No file selected",
        dismissText: t("general.toast.dismissText"),
      });
      return;
    }

    setImg(file);
    setImgUrl(URL.createObjectURL(file));
  };

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("countryCode", "00962");
      formData.append("lang", locale);

      if (img) {
        formData.append("profilePic", img);
      }

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.USERS.UPDATE_ADMIN}/${user?._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data: { isSuccess: boolean; message: string; user: User }) => {
      if (data?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: data.message,
          dismissText: t("general.toast.dismissText"),
        });

        form.reset();
        setImg(null);
        setImgUrl("");
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
      {/* Profile Picture Upload */}
      <div className="w-40 min-h-20 bg-[#eeeef7] rounded p-5 flex items-center justify-center">
        <input
          ref={imgInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />

        <div
          style={{
            backgroundImage:
              imgUrl || user?.profilePic
                ? `url(${imgUrl || user?.profilePic})`
                : "none",
          }}
          className="w-24 h-24 bg-white-50 rounded-full flex items-center justify-center shadow-md bg-cover bg-center overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleImageSelect}
        >
          {!imgUrl && <ImagePlus className="text-primary-500 w-5 h-5" />}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.firstName.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
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

            <div className="flex-1">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.lastName.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
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

          {/* Contact Fields */}
          <div className="flex gap-5">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.phoneNumber.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
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

            <div className="flex-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.auth.components.AuthTabs.components.register.dataSet.email.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className={getInputClassName()}
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={getFormItemClassName()}>
                <FormLabel className="text-sm font-normal">
                  {t(
                    "routes.auth.components.AuthTabs.components.register.dataSet.password.label"
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className={getInputClassName(
                        isArabic ? "pl-10" : "pr-10"
                      )}
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
                      } flex items-center text-gray-500 hover:text-gray-700`}
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

          {/* Checkboxes */}
          <div
            className={`flex gap-5 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem
                  dir={isArabic ? "rtl" : "ltr"}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <FormControl className="h-4 mt-2">
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="marketingEmails"
                    className="text-sm font-normal cursor-pointer"
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
                  dir={isArabic ? "rtl" : "ltr"}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <FormControl className="h-4 mt-2">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="termsAccepted"
                    className="text-sm font-normal cursor-pointer"
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
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 disabled:opacity-50 transition-all"
          >
            {registerMutation.isPending
              ? t("general.loadingStates.loadingApi")
              : t(
                  "routes.auth.components.AuthTabs.components.register.actions.proceed"
                )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditAdminUserForm);
