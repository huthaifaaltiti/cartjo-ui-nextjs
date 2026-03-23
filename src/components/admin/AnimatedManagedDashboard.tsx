"use client";

import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";

const NUM_PARTICLES = 18;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const AnimatedManagedDashboard = () => {
  const t = useTranslations(
    "routes.dashboard.components.AnimatedManagedDashboard",
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [particles, setParticles] = useState<Particle[]>([]);
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = `${greeting}, Huthaifa.`;

  // Generate particles only on client to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: NUM_PARTICLES }, (_, i) => ({
        id: i,
        x: randomBetween(5, 95),
        y: randomBetween(5, 95),
        size: randomBetween(4, 10),
        duration: randomBetween(6, 14),
        delay: randomBetween(0, 8),
        opacity: randomBetween(0.06, 0.18),
      })),
    );
  }, []);

  // Typewriter
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, [fullText]);

  // Blinking cursor
  useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) scale(1); }
          50%  { transform: translateY(-22px) scale(1.08); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          33%  { transform: translate(12px, -18px) rotate(120deg); }
          66%  { transform: translate(-10px, 10px) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: currentColor;
          animation: drift linear infinite;
          pointer-events: none;
        }
        .greeting-text {
          animation: fadeIn 0.6s ease both 0.1s;
        }
        .sub-text {
          animation: fadeIn 0.6s ease both 0.3s;
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            var(--color-text-primary) 20%,
            #3b82f6 45%,
            #8b5cf6 55%,
            var(--color-text-primary) 80%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite 1.4s;
        }
        .orbit-wrap {
          animation: fadeIn 0.8s ease both 0.5s;
        }
        .ring-outer {
          animation: spin-slow 18s linear infinite;
        }
        .ring-inner {
          animation: spin-reverse 11s linear infinite;
        }
        .pulse-a {
          animation: pulse-ring 2.2s ease-out infinite;
        }
        .pulse-b {
          animation: pulse-ring 2.2s ease-out infinite 0.8s;
        }
        .badge-wrap {
          animation: fadeIn 0.5s ease both;
        }
      `}</style>

      {/* Full area container */}
      <div
        style={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: 32,
        }}
      >
        {/* Floating particles */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                color:
                  p.id % 3 === 0
                    ? "#3b82f6"
                    : p.id % 3 === 1
                      ? "#8b5cf6"
                      : "#10b981",
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${-p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Soft blurred blobs in background */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "8%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            right: "10%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "55%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Orbit rings illustration */}
        <div
          className="orbit-wrap"
          style={{
            position: "relative",
            width: 160,
            height: 160,
            marginBottom: 40,
          }}
        >
          {/* Pulse rings */}
          <div
            className="pulse-a"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid rgba(59,130,246,0.3)",
            }}
          />
          <div
            className="pulse-b"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid rgba(59,130,246,0.2)",
            }}
          />

          {/* Outer ring */}
          <div
            className="ring-outer"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px dashed rgba(139,92,246,0.25)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* Dot on outer ring */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#8b5cf6",
                opacity: 0.7,
                marginTop: -4,
              }}
            />
          </div>

          {/* Inner ring */}
          <div
            className="ring-inner"
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              border: "1px dashed rgba(59,130,246,0.3)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {/* Dot on inner ring */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3b82f6",
                opacity: 0.8,
                marginBottom: -3,
              }}
            />
          </div>

          {/* Center logo mark */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#3b82f6"
                  opacity="0.9"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#8b5cf6"
                  opacity="0.7"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#10b981"
                  opacity="0.7"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#3b82f6"
                  opacity="0.4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Greeting typewriter */}
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <h1
            className="shimmer-text"
            style={{
              fontSize: 32,
              fontWeight: 500,
              margin: "0 0 12px",
              letterSpacing: "-0.3px",
              minHeight: 42,
            }}
          >
            {typed}
            <span
              style={{
                opacity: cursorVisible ? 1 : 0,
                borderRight: "2px solid #3b82f6",
                marginLeft: 2,
                display: "inline-block",
                height: "1em",
                verticalAlign: "middle",
              }}
            />
          </h1>

          <p className="sub-text text-primary-500">
            <strong>{t("welcome")}</strong>
          </p>
          <p
            className="sub-text"
            style={{
              fontSize: 15,
              color: "var(--color-text-secondary)",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            <br />
            {t("select")}
            <br />
            {t("ready")}
            <br />
            {t("desc")}
          </p>

          {/* Subtle animated badges */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Orders",
                delay: "0.6s",
                color: "#3b82f6",
                bg: "#eff6ff",
              },
              {
                label: "Products",
                delay: "0.72s",
                color: "#10b981",
                bg: "#ecfdf5",
              },
              {
                label: "Users",
                delay: "0.84s",
                color: "#8b5cf6",
                bg: "#f5f3ff",
              },
              {
                label: "Banners",
                delay: "0.96s",
                color: "#f59e0b",
                bg: "#fffbeb",
              },
            ].map((b) => (
              <span
                key={b.label}
                className="badge-wrap"
                style={{
                  animationDelay: b.delay,
                  fontSize: 12,
                  fontWeight: 500,
                  color: b.color,
                  background: b.bg,
                  padding: "5px 14px",
                  borderRadius: 20,
                  opacity: 0,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(AnimatedManagedDashboard);
