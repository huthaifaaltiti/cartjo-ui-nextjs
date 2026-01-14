export const DEFAULT_FALLBACK_IMAGE =
  "/assets/image/png/default-fallback-image.png";

export const MEDIA_CONFIG = {
  CATEGORY: {
    IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 1,
    },
  },
  SUB_CATEGORY: {
    IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 1,
    },
  },
  BANNER: {
    IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 3,
    },
  },
  LOGO: {
    IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 1,
    },
  },
  PRODUCT: {
    IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 2,
    },
  },
  USER: {
    PROFILE_IMAGE: {
      ALLOWED_TYPES:
        "image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/tiff, image/x-tiff, image/bmp",
      MAX_SIZE: 1,
    },
  },
  OTHERS: {
    ANY: {
      ALLOWED_TYPES: "*",
      MAX_SIZE: Infinity,
    },
  },
};
