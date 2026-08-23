"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useActiveCreatorsVideosQuery } from "@/hooks/react-query/useCreatorsVideoQuery";

const FALLBACK_VIDEOS = [
  "https://cdn.pixabay.com/video/2016/07/22/3952-175860892_large.mp4",
  "https://cdn.pixabay.com/video/2020/06/07/41392-429396709_large.mp4",
  "https://cdn.pixabay.com/video/2017/05/29/9398-219552669_large.mp4",
];

export default function CreatorsHero() {
  const t = useTranslations("routes.creators.hero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: activeVideosResp } = useActiveCreatorsVideosQuery("hero");

  const videoUrls =
    activeVideosResp?.data && activeVideosResp.data.length > 0
      ? activeVideosResp.data.map((v) => v.media.url)
      : FALLBACK_VIDEOS;

  // Advance to the next video when the current one ends, wrapping around
  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % videoUrls.length);
  };

  // Load and play whenever the source changes or playlist resolves
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (isPlaying) {
      video.play().catch(() => {
        // Autoplay can be blocked before user interaction; ignore silently
      });
    }
  }, [currentIndex, isPlaying, videoUrls]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
      {/* Background video playlist */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={videoUrls.length === 1}
        onEnded={videoUrls.length > 1 ? handleEnded : undefined}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoUrls[currentIndex]} type="video/mp4" />
      </video>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end px-6 pb-20 sm:px-10 md:items-center md:pb-0 lg:px-16">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-white-50 sm:text-6xl md:text-7xl">
            {t("title.watchYour")}
            <br />
            <span className="text-primary-500">{t("title.passion")}</span>
            <br />
            {t("title.payOff")}
          </h1>

          <p className="mt-6 max-w-md text-base text-white-50/85 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button className="rounded-full bg-white-50 px-6 py-6 text-sm font-semibold text-neutral-900 hover:bg-neutral-200">
              {t("actions.explore")}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white-50/70 bg-transparent px-6 py-6 text-sm font-semibold text-white-50 hover:bg-white-50/10"
            >
              {t("actions.setupChannel")}
            </Button>
          </div>
        </div>
      </div>

      {/* Play / pause control */}
      <button
        onClick={togglePlay}
        aria-label={
          isPlaying ? t("accessibility.pauseVideo") : t("accessibility.playVideo")
        }
        className="absolute bottom-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white-50/40 bg-black-50/30 text-white-50 backdrop-blur-sm transition-colors hover:bg-black-50/50"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 translate-x-[1px]" />
        )}
      </button>
    </section>
  );
}
