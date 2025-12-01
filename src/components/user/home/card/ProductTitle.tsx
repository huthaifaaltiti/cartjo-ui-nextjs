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
      className={`min-h-[75px] font-semibold text-gray-900 text-md line-clamp-3 mb-2 transition-all ${
        isHovered && !isLoading ? "text-primary-600" : "text-gray-900"
      } ${isLoading ? "opacity-70" : ""}`}
    >
      {title} 
    </h3>
  );
}
