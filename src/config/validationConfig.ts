export const validationConfig = {
  category: {
    nameMinChars: 3,
    nameMaxChars: 50,
    imageMinChars: 2,
  },
  subCategory: {
    nameMinChars: 3,
    nameMaxChars: 50,
    imageMinChars: 2,
  },
  logo: {
    nameMinChars: 3,
    nameMaxChars: 50,
    imageMinChars: 2,
    altTextMinChars: 3,
    altTextMaxChars: 50,
  },
  banner: {
    imageMinChars: 2,
    titleMinChars: 3,
    titleMaxChars: 50,
    bannerLinkMinChars: 5,
    bannerLinkMaxChars: 255,
  },
  typeHintConfig: {
    labelMinChars: 3,
    labelMaxChars: 50,
    iconMinChars: 3,
    iconMaxChars: 50,
    clrFromMinChars: 3,
    clrFromMaxChars: 50,
    clrToMinChars: 3,
    clrToMaxChars: 50,
    textClrMinChars: 3,
    textClrMaxChars: 50,
    priorityMinChars: 1,
    priorityMaxChars: 10,
  },
  showcase: {
    titleMinChars: 3,
    titleMaxChars: 50,
    descMinChars: 3,
    descMaxChars: 200,
    linkMinChars: 5,
    linkBtnTextMaxChars: 255,
    linkBtnTextMinChars: 5,
    linkMaxChars: 255,
  },
  product: {
    name: {
      ar: {
        minCharacters: 10,
        maxCharacters: 100,
      },
      en: {
        minCharacters: 10,
        maxCharacters: 100,
      },
    },
    description: {
      ar: {
        minCharacters: 10,
        maxCharacters: 100,
      },
      en: {
        minCharacters: 10,
        maxCharacters: 100,
      },
    },
    typeHints: {
      min: 1,
      max: 10,
    },
    tags: {
      min: 1,
      max: 10,
    },
    variant: {
      description: {
        ar: {
          minCharacters: 10,
          maxCharacters: 100,
        },
        en: {
          minCharacters: 10,
          maxCharacters: 100,
        },
      },
      price: {
        min: 0.05,
        max: 100000,
      },
      discountRate: {
        min: 0,
        max: 100,
      },
      availableCount: {
        min: 1,
      },
      totalAmountCount: {
        min: 1,
      },
      sku: {
        minCharacters: 15,
        maxCharacters: 50,
      },
      typeHints: {
        min: 1,
        max: 10,
      },
      tags: {
        min: 1,
        max: 10,
      },
    },
    comment: {
      commentMinChars: 10,
      commentMaxChars: 1000,
      ratingMin: 1,
      ratingMax: 5,
    },
  },
};
