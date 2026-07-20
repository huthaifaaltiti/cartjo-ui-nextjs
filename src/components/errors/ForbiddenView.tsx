"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Lock, Mail } from "lucide-react";
import CustomImage from "../admin/shared/CustomImage";
import { useTranslations } from "next-intl";
import { SITE_CONFIG } from "@/config/site.config";

function ForbiddenView() {
  const router = useRouter();
  const t = useTranslations("errors.components.ForbiddenView");

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left — brand panel */}
      <div className="relative w-full md:w-[42%] min-h-[220px] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#1B0F33]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="pointer-events-none absolute inset-0">
          <span className="drift-a absolute top-[18%] left-[15%] w-3 h-3 rounded-[3px] bg-[#7C4DFF]/40" />
          <span className="drift-b absolute bottom-[22%] left-[70%] w-2.5 h-2.5 rounded-full bg-[#7C4DFF]/30" />
          <span className="drift-c absolute top-[65%] left-[20%] w-2 h-2 rounded-[2px] bg-[#7C4DFF]/25" />
        </div>

        <div className="relative flex flex-col items-center gap-6 px-8">
          <div className="relative flex items-center justify-center">
            <span className="pulse-glow absolute w-40 h-40 md:w-56 md:h-56 rounded-full bg-[#7C4DFF]/25 blur-2xl" />
            <div className="relative scale-[1.7] md:scale-[2.4]">
              <CustomImage
                src="/assets/image/png/logo_white.png"
                alt="app logo"
                height={60}
                width={60}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .pulse-glow {
            animation: glow 3.2s ease-in-out infinite;
          }
          @keyframes glow {
            0%,
            100% {
              transform: scale(0.92);
              opacity: 0.55;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.9;
            }
          }
          .drift-a {
            animation: drift 9s ease-in-out infinite;
          }
          .drift-b {
            animation: drift 11s ease-in-out infinite reverse;
          }
          .drift-c {
            animation: drift 7.5s ease-in-out infinite;
          }
          @keyframes drift {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(10px, -14px) rotate(20deg);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .pulse-glow,
            .drift-a,
            .drift-b,
            .drift-c {
              animation: none;
            }
          }
        `}</style>
      </div>

      {/* Right — message panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 md:py-0">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 text-[#DC2626]">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="mt-4 text-3xl md:text-[2.15rem] font-semibold text-[#15111F] leading-tight">
            {t("title")}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-[#5B5568]">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E1EA] px-5 py-2.5 text-sm font-medium text-[#15111F] hover:bg-[#F7F6FA] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {t("goBack")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B0F33] px-5 py-2.5 text-sm font-medium text-white-50 hover:bg-[#2A1B4A] transition-colors"
            >
              <Home className="w-4 h-4" />
              {t("backToHome")}
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-[#EFEDF4] flex items-center gap-2 text-sm text-[#8A84A0]">
            <Mail className="w-4 h-4" />
            <span>
              {t("contactPrompt")}{" "}
              <a
                href={`mailto:${SITE_CONFIG.supportEmail ?? "admin@cartjo.com"}`}
                className="font-medium text-[#4C2A85] hover:underline"
              >
                {t("contactLink")}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenView;
