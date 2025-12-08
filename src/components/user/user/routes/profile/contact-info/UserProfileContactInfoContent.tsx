"use client";

import { memo, useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGeneralContext } from "@/contexts/General.context";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { useUserProfileContext } from "@/contexts/UserProfileContext";

const UserProfileContactInfoContent = ({ user }: { user: User | null }) => {
  const t = useTranslations();
  const { isArabic } = useGeneralContext();
  const { setContactForm } = useUserProfileContext();

  const formSchema = z.object({
    phoneNumber: z.string().regex(/^7[789]\d{7}$/, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.validations.phoneNumber.pattern"
      ),
    }),
    email: z.string().email({
      message: t(
        "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.validations.email.invalid"
      ),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    },
  });

  const { trigger, getValues } = form;

  useEffect(() => {
    setContactForm({
      trigger: trigger,
      getValues: getValues,
    });
  }, [form, setContactForm]);

  return (
    <Form {...form}>
      <div className="w-full flex items-center justify-between gap-5">
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className={isArabic ? "text-right" : "text-left"}>
                <FormLabel className="text-sm font-normal text-gray-600">
                  {t(
                    "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.dataSet.phoneNumber.label"
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    className={`placeholder:text-xs text-xs text-gray-600 ${
                      isArabic
                        ? "placeholder:text-right"
                        : "placeholder:text-left"
                    }`}
                    placeholder={t(
                      "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.dataSet.phoneNumber.placeholder"
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
                <FormLabel className="text-sm font-normal text-gray-500">
                  {t(
                    "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.dataSet.email.label"
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className={`placeholder:text-xs text-xs ${
                      isArabic
                        ? "placeholder:text-right"
                        : "placeholder:text-left"
                    }`}
                    placeholder={t(
                      "routes.user.layout.routes.profile.components.UserProfileContactInfoContent.dataSet.email.placeholder"
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
    </Form>
  );
};

export default memo(UserProfileContactInfoContent);
