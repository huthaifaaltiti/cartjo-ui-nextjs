"use client";

import { memo, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATIC_NATIONALITIES } from "@/constants/nationalities";
import { useStaticNationalityListQuery } from "@/hooks/react-query/useNationalityQuery";

const UserProfilePersonalInfoContent = ({ user }: { user: User | null }) => {
  const t = useTranslations();
  const { isArabic } = useGeneralContext();
  const { data } = useStaticNationalityListQuery();

  const staticNationalityList = useMemo(
    () => data?.data ?? STATIC_NATIONALITIES,
    [data]
  );

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.validations.firstName.min"
      ),
    }),
    lastName: z.string().min(2, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.validations.lastName.min"
      ),
    }),
    nationality: z.string().min(1, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.validations.nationality.required"
      ),
    }),
    birthDate: z.string().min(1, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.validations.birthDate.required"
      ),
    }),
    gender: z.string().min(1, {
      message: t(
        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.validations.gender.required"
      ),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      nationality: user?.nationality || "",
      birthDate: user?.birthDate || "",
      gender: user?.gender || "",
    },
  });

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-5">
        {/* Row 1: First Name, Last Name, Nationality */}
        <div className="w-full flex items-center gap-5">
          <div className="w-1/3 min-w-[200px]">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal text-gray-600">
                    {t(
                      "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.firstName.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className={`placeholder:text-xs text-xs text-gray-600 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                      placeholder={t(
                        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.firstName.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/3 min-w-[200px]">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal text-gray-600">
                    {t(
                      "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.lastName.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className={`placeholder:text-xs text-xs text-gray-600 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                      placeholder={t(
                        "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.lastName.placeholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/3 min-w-[200px]">
            <FormField
              disabled={staticNationalityList.length === 0}
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal text-gray-600">
                    {t(
                      "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.nationality.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`text-xs text-gray-600 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        <SelectValue
                          placeholder={t(
                            "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.nationality.placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {staticNationalityList.map((nation) => (
                          <SelectItem key={nation.code} value={nation.code}>
                            {isArabic ? nation.name.ar : nation.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Row 2: Birth Date, Gender */}
        <div className="w-full flex items-center gap-5">
          <div className="w-1/3 min-w-[200px]">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal text-gray-600">
                    {t(
                      "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.gender.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`text-xs text-gray-600 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        <SelectValue
                          placeholder={t(
                            "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.gender.placeholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">
                          {t(
                            "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.gender.options.male"
                          )}
                        </SelectItem>
                        <SelectItem value="female">
                          {t(
                            "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.gender.options.female"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/3 min-w-[200px]">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className={isArabic ? "text-right" : "text-left"}>
                  <FormLabel className="text-sm font-normal text-gray-600">
                    {t(
                      "routes.user.layout.routes.profile.components.UserProfilePersonalInfoContent.dataSet.birthDate.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className={`text-xs text-gray-600 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default memo(UserProfilePersonalInfoContent);
