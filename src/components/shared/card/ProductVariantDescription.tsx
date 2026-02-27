export default function ProductVariantDescription({
  desc,
  isHovered,
  isLoading,
}: {
  desc: string;
  isHovered: boolean;
  isLoading: boolean;
}) {
  return (
    <p
      className={`
        text-xs sm:text-sm
        text-gray-500
        line-clamp-2
        leading-snug
        transition-colors duration-200
        ${isHovered && !isLoading ? "text-gray-700" : ""}
        ${isLoading ? "opacity-60" : ""}
      `}
    >
      {desc}
    </p>
  );
}