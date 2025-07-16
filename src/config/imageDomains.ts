const imageDomains =
  process.env.NODE_ENV === "development"
    ? ["localhost", "dbrpwynosmalbvxrhpdn.supabase.co"]
    : ["your-live-domain.com"];

export default imageDomains;
