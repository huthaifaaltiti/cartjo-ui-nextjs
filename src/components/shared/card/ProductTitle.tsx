type ProductTitleProps = {
  title: string;
  isHovered: boolean;
  isLoading: boolean;
  lineClamp?: 1 | 2 | 3 | 4;
};

export default function ProductTitle({
  title,
  isHovered,
  isLoading,
  lineClamp = 2,
}: ProductTitleProps) {
  const clampClass = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
  }[lineClamp];

  return (
    <h3
      className={`
    font-semibold
    text-sm sm:text-md md:text-lg
    min-h-[3.5rem]
    ${clampClass}
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
