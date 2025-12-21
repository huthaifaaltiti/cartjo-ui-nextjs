"use client";

import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "use-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jordanCities } from "@/constants/jordanCities.constant";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LocationPicker from "@/components/shared/LocationPicker";
import { ShippingAddress } from "@/types/shippingAddress.type";

interface ShippingAddressFormProps {
  onComplete: (data: ShippingAddress) => void;
}

const shippingFormSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(2, { message: t("errors.fullNameRequired") }),
    phone: z
      .string()
      .min(7, { message: t("errors.phoneRequired") })
      .regex(/^[0-9+]+$/, { message: t("errors.phoneInvalid") }),
    country: z.string().min(2, { message: t("errors.countryRequired") }),
    city: z.string().min(2, { message: t("errors.cityRequired") }),
    town: z.string().min(2, { message: t("errors.townRequired") }),
    street: z.string().min(2, { message: t("errors.streetRequired") }),
    building: z.string().optional(),
    additionalInfo: z.string().optional(),
    mapLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
        name: z.string(),
      })
      .refine((val) => !!val, { message: t("errors.mapLocationRequired") }),
  });

type FormData = z.infer<ReturnType<typeof shippingFormSchema>>;

const ShippingAddressForm = ({ onComplete }: ShippingAddressFormProps) => {
  const t = useTranslations("routes.checkout.components.ShippingAddressForm");
  const { isArabic } = useSelector((state: RootState) => state.general);

  const formSchema = shippingFormSchema(t);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      country: "Jordan",
      city: "",
      town: "",
      street: "",
      building: "",
      additionalInfo: "",
      mapLocation: undefined,
    },
  });

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const onSubmit = (values: FormData) => {
    onComplete(values);
  };

  const handleLocationChange = (loc: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    setLocation(loc);
    form.setValue("mapLocation", loc, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 bg-white-50 rounded-2xl shadow-lg p-8 mb-10"
      >
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("fullName")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("phone")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("country")}</FormLabel>
              <FormControl>
                <Input {...field} disabled placeholder={t("country")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("city")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("city")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jordanCities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {isArabic ? city.label.ar : city.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MapLocation Picker */}
        <div>
          <FormField
            control={form.control}
            name="mapLocation"
            render={() => (
              <FormItem>
                <FormLabel>{t("location")}</FormLabel>
                <LocationPicker
                  defaultPosition={location || null}
                  onChange={(loc) => handleLocationChange(loc)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {location && (
            <p className="mt-2 text-sm text-gray-600">
              {" "}
              <strong>{t("selected")}:</strong> {location.name} (
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}){" "}
            </p>
          )}
        </div>

        {/* Town */}
        <FormField
          control={form.control}
          name="town"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("town")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("town")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Street */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("street")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("street")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Building */}
        <FormField
          control={form.control}
          name="building"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("building")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("building")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Info */}
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("extraInfo")}</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder={t("extraInfo")} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-14 bg-blue-600 text-white-50 rounded-xl font-semibold"
        >
          {t("continueToPayment")}
        </Button>
      </form>
    </Form>
  );
};

export default memo(ShippingAddressForm);
