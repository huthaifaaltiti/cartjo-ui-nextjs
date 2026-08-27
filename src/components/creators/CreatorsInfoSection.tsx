"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { UserRole } from "@/enums/user-role.enum";
import assets from "@public/assets/assets.json";

export default function CreatorsInfoSection() {
  const t = useTranslations("routes.creators.info");
  const router = useRouter();

  const handleRegisterRedirect = () => {
    router.push(`/auth?role=${UserRole.CREATOR}&tab=register`);
  };

  return (
    <section
      id="explore-section"
      className="w-full bg-white-50 py-24 px-6 md:px-12 lg:px-20 text-neutral-800 border-t border-neutral-100"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto text-primary-500 leading-[1.3]">
          {t.rich("title", {
            rewarding: (chunks) => (
              <span className="relative text-neutral-900 inline-block px-2">
                {chunks}
                <div
                  className="absolute -bottom-1 left-0 w-full h-2 bg-neutral-900"
                  style={{
                    maskImage: `url(${assets.image.svg.underline})`,
                    WebkitMaskImage: `url(${assets.image.svg.underline})`,
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
              </span>
            ),
          })}
        </h2>

        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          {/* Column 1: Showcase (Create) */}
          <div className="flex flex-col items-center text-center space-y-6 group">
            {/* Visual element */}
            <div className="w-48 h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-neutral-500/5 rounded-full blur-xl group-hover:bg-neutral-500/10 transition-all duration-300" />
              {/* YouTube Creator Disc Icon with Hover Animation */}
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              >
                <defs>
                  <linearGradient
                    id="discGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4b5563" />
                    <stop offset="50%" stopColor="#374151" />
                    <stop offset="100%" stopColor="#1f2937" />
                  </linearGradient>
                  <linearGradient
                    id="innerDisc"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#1f2937" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>
                </defs>
                {/* Outer Rim */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="url(#discGrad)"
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                {/* Inner Face */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="url(#innerDisc)"
                  stroke="#111827"
                  strokeWidth="1.5"
                />
                {/* 3D Plus Sign */}
                <path
                  d="M50 32v36M32 50h36"
                  stroke="#ffffff"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                {t("create.title")}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                {t("create.desc")}
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-primary-500/30 bg-transparent px-6 py-5 text-xs font-bold text-primary-600 hover:bg-primary-500 hover:text-white-50 hover:border-primary-500 transition-all shadow-sm"
              onClick={handleRegisterRedirect}
            >
              {t("create.btn")}
            </Button>
          </div>

          {/* Column 2: Grow */}
          <div className="flex flex-col items-center text-center space-y-6 group">
            {/* Visual element */}
            <div className="w-48 h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all duration-300" />
              {/* YouTube Creator Beating Heart Icon */}
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 drop-shadow-[0_12px_24px_rgba(239,68,68,0.3)] animate-[pulse_2.5s_infinite] transform group-hover:scale-110 transition-all duration-300"
              >
                <defs>
                  <linearGradient
                    id="heartGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ff4b4b" />
                    <stop offset="40%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 88.7L43.8 83C21.8 63 7.2 49.7 7.2 33.3 7.2 19.8 17.8 9.2 31.2 9.2c7.6 0 14.8 3.5 18.8 9 4-5.5 11.2-9 18.8-9 13.5 0 24 10.6 24 24.1 0 16.4-14.6 29.7-36.6 49.8L50 88.7z"
                  fill="url(#heartGrad)"
                />
              </svg>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                {t("grow.title")}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                {t("grow.desc")}
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-primary-500/30 bg-transparent px-6 py-5 text-xs font-bold text-primary-600 hover:bg-primary-500 hover:text-white-50 hover:border-primary-500 transition-all shadow-sm"
              onClick={handleRegisterRedirect}
            >
              {t("grow.btn")}
            </Button>
          </div>

          {/* Column 3: Sell & Earn */}
          <div className="flex flex-col items-center text-center space-y-6 group">
            {/* Visual element */}
            <div className="w-48 h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-300" />
              {/* YouTube Creator Golden Coin Icon */}
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 drop-shadow-[0_12px_24px_rgba(245,158,11,0.35)] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
              >
                <defs>
                  <linearGradient
                    id="goldGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient
                    id="innerGold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
                {/* Outer Coin Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="url(#goldGrad)"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                {/* Inner Face */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="url(#goldGrad)"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
                {/* Coin Inlay Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                {/* 3D Dollar Sign Text */}
                <text
                  x="50"
                  y="65"
                  textAnchor="middle"
                  fill="url(#innerGold)"
                  fontSize="42"
                  fontWeight="900"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  style={{ userSelect: "none" }}
                >
                  $
                </text>
              </svg>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                {t("earn.title")}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                {t("earn.desc")}
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-primary-500/30 bg-transparent px-6 py-5 text-xs font-bold text-primary-600 hover:bg-primary-500 hover:text-white-50 hover:border-primary-500 transition-all shadow-sm"
              onClick={handleRegisterRedirect}
            >
              {t("earn.btn")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
