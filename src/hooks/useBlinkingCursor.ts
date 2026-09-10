import { useEffect, useState } from "react";

export function useBlinkingCursor(intervalMs = 530) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setVisible((v) => !v), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return visible;
}
