import React from "react";

interface LegalPageHeaderProps {
  title: string;
  date?: string;
}

const LegalPageHeader: React.FC<LegalPageHeaderProps> = ({ title, date }) => {
  return (
    <div className="w-full h-auto bg-gradient-to-r from-white-50 via-gray-50 to-white-50 mb-3">
      <div className="w-full min-h-40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
        {date && (
          <p className="text-xs text-gray-600 mt-2 leading-none">{date}</p>
        )}
      </div>
    </div>
  );
};

export default LegalPageHeader;
