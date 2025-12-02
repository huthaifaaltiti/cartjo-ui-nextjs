interface DiscountBadgeProps {
  discount: number;
}

export default function DiscountBadge({ discount }: DiscountBadgeProps) {
  if (!discount) return null;

  return (
    <div className="absolute top-2 sm:top-3 left-2 sm:left-4 z-10">
      <div
        className="
          bg-gradient-to-r from-primary-400 to-primary-600
          text-white
          px-2 py-1
          sm:px-3 sm:py-1.5
          rounded-full
          text-xs sm:text-sm md:text-base
          font-bold
          shadow-md sm:shadow-lg
        "
      >
        -{discount}%
      </div>
    </div>
  );
}
