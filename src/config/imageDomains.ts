export const imageDomains =
  process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(",").map(domain =>
    domain.replace("https://", "").replace("http://", "").trim()
  ) || [];

console.log("Loaded Image Domains:", imageDomains);

export default imageDomains;
