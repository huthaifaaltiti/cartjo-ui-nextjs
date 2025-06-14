import React, { memo, useMemo } from "react";

type ToggleSwitchProps = {
  value: boolean;
  onChange: () => void;
  width: number;
  height: number;
  handleColor?: string;
  trackColorInactive?: string;
  trackColorActive?: string;
  isDisabled: boolean;
};

const ToggleSwitch = ({
  value = false,
  onChange,
  width = 70,
  height = 30,
  handleColor = "#FFF",
  trackColorInactive = "#EA2F14",
  trackColorActive = "#1D4ED8",
  isDisabled = false,
}: ToggleSwitchProps) => {
  const handleDiameter = useMemo(() => height - 4, [height]);
  const handleOffset = useMemo(
    () => width - handleDiameter - 4,
    [width, handleDiameter]
  );

  const containerStyle = useMemo(
    () => ({
      width: `${width}px`,
      height: `${height}px`,
      cursor: isDisabled ? "not-allowed" : "pointer",
    }),
    [width, height, isDisabled]
  );

  const trackStyle = useMemo(
    () => ({
      backgroundColor: value ? trackColorActive : trackColorInactive,
    }),
    [value, trackColorActive, trackColorInactive]
  );

  const handleStyle = useMemo(
    () => ({
      width: `${handleDiameter}px`,
      height: `${handleDiameter}px`,
      backgroundColor: handleColor,
      transform: `translateY(-50%) translateX(${value ? handleOffset : 2}px)`,
    }),
    [handleDiameter, handleColor, value, handleOffset]
  );

  const handleToggle = () => {
    if (!isDisabled && onChange) {
      onChange();
    }
  };

  return (
    <div
      className={`toggle-switch ${isDisabled ? "disabled" : ""}`}
      style={containerStyle}
      onClick={handleToggle}
    >
      <div className="track" style={trackStyle} />
      <div className="handle" style={handleStyle} />
      <style jsx>{`
        .toggle-switch {
          position: relative;
          display: inline-block;
        }
        .track {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          transition: background-color 300ms;
        }
        .handle {
          position: absolute;
          top: 50%;
          left: 2px;
          border-radius: 9999px;
          transition: transform 300ms;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default memo(ToggleSwitch);
