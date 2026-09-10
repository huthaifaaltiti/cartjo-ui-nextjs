const AnimationStyles = () => (
  <style>{`
    @keyframes float {
      0%   { transform: translateY(0px) scale(1); }
      50%  { transform: translateY(-16px) scale(1.06); }
      100% { transform: translateY(0px) scale(1); }
    }
    @keyframes drift {
      0%   { transform: translate(0, 0) rotate(0deg); }
      33%  { transform: translate(10px, -14px) rotate(120deg); }
      66%  { transform: translate(-8px, 8px) rotate(240deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
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
      100% { transform: scale(1.4); opacity: 0; }
    }
    .creator-particle {
      position: absolute;
      border-radius: 50%;
      background: currentColor;
      animation: drift linear infinite;
      pointer-events: none;
    }
    .creator-shimmer-text {
      background: linear-gradient(
        90deg,
        #6d28d9 20%,
        #3b82f6 45%,
        #ec4899 55%,
        #6d28d9 80%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3.5s linear infinite 1.4s;
    }
    .creator-pulse-a {
      animation: pulse-ring 2.2s ease-out infinite;
    }
    .creator-pulse-b {
      animation: pulse-ring 2.2s ease-out infinite 0.8s;
    }
    .creator-ring-outer {
      animation: spin-slow 18s linear infinite;
    }
    .creator-ring-inner {
      animation: spin-reverse 11s linear infinite;
    }
    .creator-fade-in {
      animation: fadeIn 0.5s ease both;
    }
  `}</style>
);

export default AnimationStyles;
