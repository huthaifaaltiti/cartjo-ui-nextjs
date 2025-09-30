// formatLocalizedDate
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

export const formatRelativeDate = (dateString: Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};
