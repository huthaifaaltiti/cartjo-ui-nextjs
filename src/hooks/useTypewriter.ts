import { useEffect, useState } from "react";

export function useTypewriter(text: string, speedMs = 55) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speedMs);
    return () => clearInterval(timer);
  }, [text, speedMs]);

  return typed;
}
