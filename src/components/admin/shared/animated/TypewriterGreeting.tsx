import { useTypewriter } from "@/hooks/useTypewriter";
import { useBlinkingCursor } from "@/hooks/useBlinkingCursor";

interface TypewriterGreetingProps {
  text: string;
  subheading: string;
  subtitle: string;
}

const TypewriterGreeting = ({
  text,
  subheading,
  subtitle,
}: TypewriterGreetingProps) => {
  const typed = useTypewriter(text);
  const cursorVisible = useBlinkingCursor();

  return (
    <div className="text-center max-w-xl mx-auto z-10 shrink-0 mb-3 sm:mb-4">
      <h1 className="creator-shimmer-text text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 min-h-[34px]">
        {typed}
        <span
          style={{
            opacity: cursorVisible ? 1 : 0,
            borderRight: "2px solid #8b5cf6",
            marginLeft: 3,
            display: "inline-block",
            height: "0.85em",
            verticalAlign: "middle",
          }}
        />
      </h1>

      <p className="text-sm font-semibold text-primary-600 mb-0.5">
        {subheading}
      </p>

      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed line-clamp-2">
        {subtitle}
      </p>
    </div>
  );
};

export default TypewriterGreeting;
