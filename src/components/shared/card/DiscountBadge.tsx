import { useTranslations } from "next-intl";

interface DiscountBadgeProps {
  discount: number;
  label?: string;
  isRow?: boolean;
}

export default function DiscountBadge({
  discount,
  label,
  isRow = false,
}: DiscountBadgeProps) {
  const t = useTranslations("components.DiscountBadge");

  if (!discount || discount <= 0) return null;

  if (isRow) {
    return (
      <div
        className="absolute bottom-0 ltr:left-0 rtl:right-0 z-10 overflow-hidden"
        style={{ width: 80, height: 80, pointerEvents: "none" }}
      >
        <style>{`
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            width: 110,
            textAlign: "center",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 2px 8px rgba(124, 58, 237, 0.45)",
            padding: "3px 0",
          }}
          className="ltr:left-[-26px] ltr:rotate-45 rtl:right-[-26px] rtl:-rotate-45"
        >
          {/* Shimmer overlay */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
              animation: "shimmer 2.4s infinite",
            }}
          />
          <span
            style={{
              display: "block",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            {label || t("save")}
          </span>
          <span
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.3,
            }}
          >
            -{discount}%
          </span>
        </div>
      </div>
    );
  }

  // Default: top-right corner ribbon (vertical card)
  return (
    <div
      className="absolute top-0 ltr:right-0 rtl:left-0 z-10 overflow-hidden"
      style={{ width: 72, height: 72, pointerEvents: "none" }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: 14,
          width: 96,
          textAlign: "center",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          boxShadow: "0 2px 8px rgba(124, 58, 237, 0.45)",
          padding: "3px 0",
        }}
        className="ltr:right-[-22px] ltr:rotate-45 rtl:left-[-22px] rtl:-rotate-45"
      >
        {/* Shimmer overlay */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            animation: "shimmer 2.4s infinite",
          }}
        />
        <span
          style={{
            display: "block",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.2,
            textTransform: "uppercase",
          }}
        >
          {label || t("save")}
        </span>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          -{discount}%
        </span>
      </div>
    </div>
  );
}
