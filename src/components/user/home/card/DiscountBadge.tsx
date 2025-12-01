interface DiscountBadgeProps {
  discount: number;
}

export default function DiscountBadge({ discount }: DiscountBadgeProps) {
  if (!discount) return null;

  return (
    <div className="absolute top-3 left-4 z-10">
      <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white-50 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
        -{discount}%
      </div>
    </div>
  );
}
