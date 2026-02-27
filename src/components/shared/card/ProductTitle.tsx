export default function ProductTitle({
  title,
  isHovered,
  isLoading,
}: {
  title: string;
  isHovered: boolean;
  isLoading: boolean;
}) {
  return (
    <h3
      className={`
        font-semibold
        text-gray-900
        text-sm sm:text-md md:text-lg
        line-clamp-3
        mb-2
        transition-all
        ${isHovered && !isLoading ? "text-primary-600" : "text-gray-900"}
        ${isLoading ? "opacity-70" : ""}
        first-letter-capital
      `}
    >
      {title}
    </h3>
  );
}
