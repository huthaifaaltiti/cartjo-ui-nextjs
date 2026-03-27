interface DiscountSmallPercentBadgeProps {
  discountRate: number;
  className?: string;
}

const DiscountSmallPercentBadge = ({
  discountRate,
  className = "",
}: DiscountSmallPercentBadgeProps) => {
  if (!discountRate) return null;

  return (
    <span
      className={
        className
          ? className
          : "text-xs font-semibold text-white-50 bg-emerald-500 py-0.5 px-1 rounded-full animate-bounce"
      }
    >
      -{discountRate}%
    </span>
  );
};

export default DiscountSmallPercentBadge;
