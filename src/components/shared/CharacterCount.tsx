import { cn } from "@/lib/utils";

interface CharacterCountProps {
  /** Current text value (its length is counted). */
  value?: string | null;
  /** Maximum allowed characters. */
  max: number;
  /** Optional minimum; when set, a non-empty value shorter than this is flagged. */
  min?: number;
  /** Ratio (0-1) of `max` at which the counter starts warning. Defaults to 0.9. */
  warnAt?: number;
  className?: string;
}

export default function CharacterCount({
  value,
  max,
  min,
  warnAt = 0.9,
  className,
}: CharacterCountProps) {
  const count = value?.length ?? 0;
  const isOver = count > max;
  const isBelowMin = typeof min === "number" && count > 0 && count < min;
  const isNearLimit = !isOver && count >= Math.floor(max * warnAt);

  return (
    <span
      aria-live="polite"
      className={cn(
        "block text-[11px] font-medium tabular-nums text-end text-gray-400",
        (isNearLimit || isBelowMin) && "text-amber-500",
        isOver && "text-red-500",
        className,
      )}
    >
      {count}/{max}
    </span>
  );
}
