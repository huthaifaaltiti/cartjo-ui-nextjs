import { useParticles } from "@/hooks/useParticles";

const PARTICLE_COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981"];

const ParticleField = ({ count = 16 }: { count?: number }) => {
  const particles = useParticles(count);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="creator-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            color: PARTICLE_COLORS[p.id % PARTICLE_COLORS.length],
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${-p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
