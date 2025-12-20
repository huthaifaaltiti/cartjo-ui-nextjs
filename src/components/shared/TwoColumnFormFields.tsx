import React from "react";
import { Direction } from "@/types/common";

interface TwoColumnFormFieldsProps {
  leftField: React.ReactNode;
  rightField: React.ReactNode;
  leftError?: string;
  rightError?: string;
  dir?: Direction;
}

const TwoColumnFormFields: React.FC<TwoColumnFormFieldsProps> = ({
  leftField,
  rightField,
  leftError,
  rightError,
  dir,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* TOP ROW - TWO FIELDS */}
      <div className="w-full flex items-start justify-between gap-5">
        <div className="w-full">{leftField}</div>
        <div className="w-full">{rightField}</div>
      </div>

      {/* ERROR ROW */}
      <div
        className={"w-full flex items-start gap-5"}
        style={{
          direction: dir,
        }}
      >
        <span className="w-full text-[#ef4445] text-xs font-medium">
          {leftError}
        </span>
        <span className="w-full text-[#ef4445] text-xs font-medium">
          {rightError}
        </span>
      </div>
    </div>
  );
};

export default TwoColumnFormFields;
