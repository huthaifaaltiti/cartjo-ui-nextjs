type ProductVariantDescriptionProps = {
  desc: string;
  isHovered: boolean;
  isLoading: boolean;
  lineClamp?: 1 | 2 | 3 | 4;
};

export default function ProductVariantDescription({
  desc,
  isHovered,
  isLoading,
  lineClamp = 1,
}: ProductVariantDescriptionProps) {
  const clampClass =
    {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
    }[lineClamp] || "line-clamp-1";

  return (
    <p
      className={`
        text-xs sm:text-sm
        text-gray-500
        ${clampClass}
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
