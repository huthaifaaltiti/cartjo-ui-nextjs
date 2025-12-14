export const imageDomains =
  process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(",").map(domain =>
    domain.replace("https://", "").replace("http://", "").trim()
  ) || [];

export default imageDomains;
