import { memo } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Login from "./Login";
import Register from "./Register";

const AuthTabs = () => {
  const t = useTranslations();

  const triggerClasses =
    "w-1/2 min-h-10 bg-transparent border-none shadow-none font-bold text-lg text-text-primary-100 data-[state=active]:text-text-primary-400 sm:data-[state=active]:text-[30px] data-[state=active]:text-[23px] data-[state=active]:shadow-none";

  return (
    <Tabs defaultValue="login" className="w-full bg-transparent">
      <TabsList className="w-full min-h-14 px-3 bg-transparent">
        <TabsTrigger
          value="login"
          className={`${triggerClasses} flex justify-end`}
        >
          {t("routes.auth.components.AuthTabs.login")}
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className={`${triggerClasses} flex justify-start`}
        >
          {t("routes.auth.components.AuthTabs.register")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="register">
        <Register />
      </TabsContent>
    </Tabs>
  );
};

export default memo(AuthTabs);
