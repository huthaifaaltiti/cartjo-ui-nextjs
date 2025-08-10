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
};
