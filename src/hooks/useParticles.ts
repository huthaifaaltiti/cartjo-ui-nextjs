import { useEffect, useState } from "react";

export type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function useParticles(count = 16) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate only on client to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: randomBetween(5, 95),
        y: randomBetween(5, 95),
        size: randomBetween(4, 9),
        duration: randomBetween(6, 14),
        delay: randomBetween(0, 8),
        opacity: randomBetween(0.06, 0.18),
      })),
    );
  }, [count]);

  return particles;
}
