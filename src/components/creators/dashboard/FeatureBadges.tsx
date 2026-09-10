interface Badge {
  label: string;
  color: string;
  bg: string;
}

const FeatureBadges = ({ badges }: { badges: Badge[] }) => (
  <div className="flex flex-wrap items-center justify-center gap-1.5 z-10 shrink-0">
    {badges.map((badge, idx) => (
      <span
        key={badge.label}
        className="creator-fade-in text-xs font-medium px-3 py-0.5 rounded-full border border-gray-200/60 shadow-2xs transition-transform hover:scale-105"
        style={{
          color: badge.color,
          backgroundColor: badge.bg,
          animationDelay: `${0.3 + idx * 0.08}s`,
        }}
      >
        {badge.label}
      </span>
    ))}
  </div>
);

export default FeatureBadges;
