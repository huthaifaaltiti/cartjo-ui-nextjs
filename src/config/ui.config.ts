export const UI_CONFIG = {
  loading: {
    dots: {
      size: "2rem",
      color: "#634C9F",
      count: 3,
      speed: "1.2s",
    },
    spinner: {
      size: "2rem",
      color: "#634C9F",
      strokeWidth: "2px",
    },
    skeleton: {
      baseColor: "#f3f4f6",
      highlightColor: "#e5e7eb",
      animationDuration: "1.5s",
    },
  },

  colors: {
    primary: "#634C9F",
    secondary: "#6B7280",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
    muted: "#9CA3AF",
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      muted: "#F3F4F6",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      muted: "#9CA3AF",
      inverse: "#FFFFFF",
    },
  },

  typography: {
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  spacing: {
    sections: {
      padding: "py-11",
      margin: "mb-8",
      gap: "gap-6",
    },
    components: {
      padding: "p-4",
      margin: "mb-4",
      gap: "gap-2",
    },
  },

  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "ease-in-out",
      bouncy: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  components: {
    carousel: {
      autoplay: {
        delay: 4000,
        stopOnInteraction: false,
      },
      breakpoints: {
        mobile: "basis-1/3",
        tablet: "md:basis-1/5",
        desktop: "lg:basis-1/6",
      },
    },
    card: {
      height: {
        category: "h-32",
        product: "h-48",
        feature: "h-64",
      },
      padding: "p-4",
      borderRadius: "rounded-xl",
      shadow: {
        default: "shadow-sm",
        hover: "hover:shadow-md",
      },
    },
    section: {
      height: {
        category: "h-60",
        product: "h-80",
        hero: "h-96",
      },
    },
  },

  messages: {
    loading: {
      default: "Loading...",
      categories: "Loading categories...",
      products: "Loading products...",
      search: "Searching...",
    },
    error: {
      default: "Something went wrong",
      network: "Network error occurred",
      categories: "Failed to load categories",
      products: "Failed to load products",
      retry: "Please try again later",
    },
    empty: {
      categories: {
        title: "No categories found",
        subtitle: "Check back later for new categories",
      },
      products: {
        title: "No products found",
        subtitle: "Try adjusting your search criteria",
      },
      search: {
        title: "No results found",
        subtitle: "Try different keywords",
      },
    },
  },
} as const;

export type LoadingConfig = typeof UI_CONFIG.loading;
export type ColorsConfig = typeof UI_CONFIG.colors;
export type ComponentsConfig = typeof UI_CONFIG.components;
export type MessagesConfig = typeof UI_CONFIG.messages;

export const getLoadingDots = () => UI_CONFIG.loading.dots;
export const getLoadingSpinner = () => UI_CONFIG.loading.spinner;
export const getColors = () => UI_CONFIG.colors;
export const getMessages = () => UI_CONFIG.messages;
export const getComponentConfig = (component: keyof ComponentsConfig) =>
  UI_CONFIG.components[component];
