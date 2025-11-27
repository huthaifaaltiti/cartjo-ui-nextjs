import React from "react";

interface TwoColumnFormFieldsProps {
  leftField: React.ReactNode;
  rightField: React.ReactNode;
  leftError?: string;
  rightError?: string;
  isArabic?: boolean;
}

const TwoColumnFormFields: React.FC<TwoColumnFormFieldsProps> = ({
  leftField,
  rightField,
  leftError,
  rightError,
  isArabic = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* TOP ROW - TWO FIELDS */}
      <div
        className={`w-full flex items-start justify-between gap-5 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-full">{leftField}</div>
        <div className="w-full">{rightField}</div>
      </div>

      {/* ERROR ROW */}
      <div
        className={`w-full flex items-start gap-5 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        <span className="w-full text-[#ef4445] text-xs font-medium">{leftError}</span>
        <span className="w-full text-[#ef4445] text-xs font-medium">{rightError}</span>
      </div>
    </div>
  );
};

export default TwoColumnFormFields;
