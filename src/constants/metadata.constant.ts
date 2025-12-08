import { RouteMetaDta } from "@/types/metadata.type";

export const METADATA_ROUTES_NAMES = {
  HOME: "Home",
  AUTH: "Auth",
};

export const routesMetadata: Record<string, RouteMetaDta> = {
  [METADATA_ROUTES_NAMES.HOME]: {
    routeName: METADATA_ROUTES_NAMES.HOME,
    routePath: "/",
    title: {
      en: "CartJO | Online Shopping at Jordan",
      ar: "كارت جو | التسوق عبر الإنترنت في الأردن",
    },
    description: {
      en: "تطبيق تجارة إلكترونية مقره الأردن",
      ar: "An e-commerce application based in Jordan",
    },
  },

  [METADATA_ROUTES_NAMES.AUTH]: {
    routeName: METADATA_ROUTES_NAMES.AUTH,
    routePath: "/auth",
    title: {
      en: "Login & Register | CartJO",
      ar: "كارت جو | تسجيل الدخول و إنشاء حساب",
    },
    description: {
      en: "Access your CartJO account by logging in or creating a new account.",
      ar: "قم بتسجيل الدخول إلى حسابك في كارت جو أو إنشاء حساب جديد.",
    },
  },
};
