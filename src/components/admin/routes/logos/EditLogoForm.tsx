"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useLogos } from "@/contexts/LogosContext";
import LoadingButton from "@/components/shared/LoadingButton";
import { Logo } from "@/types/logo";
import { invalidateQuery } from "@/utils/queryUtils";
import { validationConfig } from "@/config/validationConfig";
import { isArabicLocale } from "@/config/locales.config";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { MEDIA_CONFIG } from "@/config/media.config";
import { authFetcher } from "@/utils/authFetcher";
import { DataResponse } from "@/types/service-response.type";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import { showNoPermissionToast } from "@/utils/permissionToast";
import { LogoType } from "@/enums/logoType.enum";

const editFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string,
) => {
  const {
    nameMinChars,
    nameMaxChars,
    imageMinChars,
    altTextMinChars,
    altTextMaxChars,
  } = validationConfig.logo;

  const nameField = (fieldKey: "name_ar" | "name_en") =>
    z
      .string()
      .min(nameMinChars, {
        message: t(
          `routes.dashboard.routes.logos.components.EditLogoForm.validations.${fieldKey}.minChars`,
          { min: nameMinChars },
        ),
      })
      .max(nameMaxChars, {
        message: t(
          `routes.dashboard.routes.logos.components.EditLogoForm.validations.${fieldKey}.maxChars`,
          { max: nameMaxChars },
        ),
      });

  const altTextField = (fieldKey: "altText_ar" | "altText_en") =>
    z
      .string()
      .min(altTextMinChars, {
        message: t(
          `routes.dashboard.routes.logos.components.EditLogoForm.validations.${fieldKey}.minChars`,
          { min: altTextMinChars },
        ),
      })
      .max(altTextMaxChars, {
        message: t(
          `routes.dashboard.routes.logos.components.EditLogoForm.validations.${fieldKey}.maxChars`,
          { max: altTextMaxChars },
        ),
      });

  return z.object({
    logoImage_ar: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.logos.components.EditLogoForm.validations.logoImage_ar.required",
      ),
    }),
    logoImage_en: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.logos.components.EditLogoForm.validations.logoImage_en.required",
      ),
    }),
    name_ar: nameField("name_ar"),
    name_en: nameField("name_en"),
    altText_ar: altTextField("altText_ar"),
    altText_en: altTextField("altText_en"),
    type: z.nativeEnum(LogoType, {
      errorMap: () => ({
        message: t(
          "routes.dashboard.routes.logos.components.EditLogoForm.validations.type.required",
        ),
      }),
    }),
  });
};

type FormData = z.infer<ReturnType<typeof editFormSchema>>;

type LogoImageState = {
  file: File | null;
  url: string;
};

const EditLogoForm = ({ logo }: { logo: Logo }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { queryKey } = useLogos();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const imageUploaderRef_ar = useRef<ImageUploaderRef>(null);
  const imageUploaderRef_en = useRef<ImageUploaderRef>(null);

  const [logoImage_ar, setLogoImage_ar] = useState<LogoImageState>({
    file: null,
    url: logo?.media?.ar?.url || "",
  });
  const [logoImage_en, setLogoImage_en] = useState<LogoImageState>({
    file: null,
    url: logo?.media?.en?.url || "",
  });

  const { canUpdateLogo } = usePermission({
    canUpdateLogo: Permission.LOGOS_UPDATE,
  });

  const formSchema = editFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoImage_ar: logo?.media?.ar?.url || "",
      logoImage_en: logo?.media?.en?.url || "",
      name_ar: logo?.name?.ar || "",
      name_en: logo?.name?.en || "",
      altText_ar: logo?.altText?.ar || "",
      altText_en: logo?.altText?.en || "",
      type: logo?.type || LogoType.MAIN,
    },
  });

  const handleImageChange_ar = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setLogoImage_ar({ file: data.file ?? null, url });
    form.setValue("logoImage_ar", url, { shouldValidate: true });
  };

  const handleImageChange_en = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setLogoImage_en({ file: data.file ?? null, url });
    form.setValue("logoImage_en", url, { shouldValidate: true });
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

      const excludedFields = ["logoImage_ar", "logoImage_en"];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        formData.append(key, String(value));
      });

      formData.append("lang", locale);

      if (logoImage_ar?.file) {
        formData.append("image_ar", logoImage_ar.file);
      }

      if (logoImage_en?.file) {
        formData.append("image_en", logoImage_en.file);
      }

      const response = await authFetcher<DataResponse<Logo>>(
        `${API_ENDPOINTS.DASHBOARD.LOGOS.EDIT}/${logo?._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.isSuccess) {
        throw new Error(
          response?.message ||
            t("routes.dashboard.routes.logos.editLogo.actionFailed"),
        );
      }

      return response;
    },
    onSuccess: async (data: DataResponse<Logo>) => {
      if (data?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: data.message,
          dismissText: t("general.toast.dismissText"),
        });

        await invalidateQuery(queryClient, queryKey);
      }
    },
    onError: (error: Error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (values: FormData) => {
    if (!canUpdateLogo) {
      showNoPermissionToast(t);
      return;
    }

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full flex items-center gap-6">
            <FormField
              control={form.control}
              name="logoImage_ar"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t("routes.dashboard.routes.logos.editLogo.uploadImage_ar")}
                  </FormLabel>
                  <ImageUploader
                    ref={imageUploaderRef_ar}
                    value={logoImage_ar.url}
                    onChange={handleImageChange_ar}
                    onError={handleImageError}
                    label={""}
                    maxSizeInMB={MEDIA_CONFIG.LOGO.IMAGE.MAX_SIZE}
                    size="sm"
                    variant="rounded"
                    accept={MEDIA_CONFIG.LOGO.IMAGE.ALLOWED_TYPES}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoImage_en"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t("routes.dashboard.routes.logos.editLogo.uploadImage_en")}
                  </FormLabel>
                  <ImageUploader
                    ref={imageUploaderRef_en}
                    value={logoImage_en.url}
                    onChange={handleImageChange_en}
                    onError={handleImageError}
                    label={""}
                    maxSizeInMB={MEDIA_CONFIG.LOGO.IMAGE.MAX_SIZE}
                    size="sm"
                    variant="rounded"
                    accept={MEDIA_CONFIG.LOGO.IMAGE.ALLOWED_TYPES}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.name_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.EditLogoForm.fields.name_ar.placeholder",
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
                name="name_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.name_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.EditLogoForm.fields.name_en.placeholder",
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

          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="altText_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.altText_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.EditLogoForm.fields.altText_ar.placeholder",
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
                name="altText_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.altText_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.EditLogoForm.fields.altText_en.placeholder",
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className={getFormItemClassName()}>
                <FormLabel className="text-sm font-normal">
                  {t(
                    "routes.dashboard.routes.logos.components.EditLogoForm.fields.type.label",
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={getInputClassName()}>
                      <SelectValue
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.EditLogoForm.fields.type.placeholder",
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={LogoType.MAIN}>
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.type.options.main",
                      )}
                    </SelectItem>
                    <SelectItem value={LogoType.CREATORS}>
                      {t(
                        "routes.dashboard.routes.logos.components.EditLogoForm.fields.type.options.creators",
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            loading={registerMutation.isPending}
            withAnimate={true}
            label={t("general.actions.proceed")}
            loadingLabel={t("general.UploadingStates.uploadingData")}
          />
        </form>
      </Form>
    </div>
  );
};

export default memo(EditLogoForm);
