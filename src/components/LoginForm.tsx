import { memo } from "react";
import { useTranslations } from "next-intl";
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

const formSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier must be at least 3 characters" })
    .max(50)
    .refine(
      (val) =>
        /^[a-zA-Z0-9._]{2,50}$/.test(val) || // username pattern
        /^7[789]\d{7}$/.test(val) || // Jordanian mobile pattern
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), // email pattern
      {
        message: "Must be a valid username, Jordanian phone number, or email",
      }
    ),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm: React.FC = () => {
  const t = useTranslations("routes.auth.components.AuthTabs.components.login");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal">
                {t("dataSet.username.label")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("dataSet.username.placeholder")}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-text-primary-400 font-normal">
                {t("dataSet.password.label")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("dataSet.password.placeholder")}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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

export default memo(LoginForm);
