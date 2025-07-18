import { memo } from "react";

import styles from "./styles.module.css";

const LoadingDots = () => {
  return (
    <div className={styles.loadingDots}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={{ animationDelay: `${i * 0.5}s` }}
        >
          .
        </span>
      ))}
    </div>
  );
};

export default memo(LoadingDots);
