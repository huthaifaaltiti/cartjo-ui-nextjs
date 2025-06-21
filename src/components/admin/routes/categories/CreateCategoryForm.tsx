"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
} from "@/components/shared/CustomToast";
import ImageUploader, {
  ImageUploaderRef,
} from "@/components/shared/ImageUploader";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";
import { useCategories } from "@/contexts/CategoriesContext";

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

const CreateCategoryForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { accessToken } = useCategories();

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [profileImage, setProfileImage] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
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

  const handleImageChange = (file: File | null, url: string) => {
    setProfileImage({ file, url });
  };

  const handleImageError = (error: string) => {
    showErrorToast({
      title: t("general.toast.title.error"),
      description: error,
      dismissText: t("general.toast.dismissText"),
    });
  };

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("countryCode", "00962");
      formData.append("lang", locale);

      if (profileImage.file) {
        formData.append("profilePic", profileImage.file);
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.USERS.CREATE_ADMIN, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
        imageUploaderRef.current?.clear();
      }
    },
    onError: (error: Error) => {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: error.message,
        dismissText: t("general.toast.dismissText"),
      });
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
      <ImageUploader
        ref={imageUploaderRef}
        value={profileImage.url}
        onChange={handleImageChange}
        onError={handleImageError}
        label={t(
          "routes.dashboard.routes.categories.createCategory.uploadImage"
        )}
        maxSizeInMB={2}
        size="sm"
        variant="rounded"
        accept="image/png, image/jpeg, image/jpg"
      />

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

export default memo(CreateCategoryForm);
