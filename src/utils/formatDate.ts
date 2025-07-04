export const formatDate = (
  dateString: Date | string,
  lang: string,
  timeZone: string = "Asia/Amman"
): string => {
  const isArabic = lang?.toLowerCase()?.includes("ar");

  return (
    new Date(dateString)?.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone,
      numberingSystem: isArabic ? "arab" : "latn",
    }) || "NA"
  );
};
