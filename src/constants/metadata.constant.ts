interface RouteMetaDta {
  routeName: string;
  routePath: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export const METADATA_ROUTES_NAMES = {
  HOME: "Home",
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
};
