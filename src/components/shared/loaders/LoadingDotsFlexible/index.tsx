import { memo } from "react";
import styles from "./styles.module.css";

type LoadingDotsFlexibleProps = {
  count?: number;
  size?: string;
  color?: string;
  className?: string;
};

const LoadingDotsFlexible = ({
  count = 3,
  size = "1rem",
  color = "#000000",
  className = "",
}: LoadingDotsFlexibleProps) => {
  return (
    <div className={`${styles.loadingDots} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={{
            animationDelay: `${i * 0.3}s`,
            fontSize: size,
            color: color,
          }}
        >
          •
        </span>
      ))}
    </div>
  );
};

export default memo(LoadingDotsFlexible);
