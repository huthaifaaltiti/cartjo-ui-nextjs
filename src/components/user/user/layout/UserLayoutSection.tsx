import { memo } from "react";
import Link from "next/link";

export type UserLayoutSectionItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  isContainsPathname?: boolean;
};

interface UserLayoutSectionProps {
  header?: string;
  items: UserLayoutSectionItem[];
}

const UserLayoutSection = ({ header, items }: UserLayoutSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full">
      {header && (
        <h3 className="mx-4 my-1 text-xs text-text-primary-100 font-semibold uppercase">
          {header}
        </h3>
      )}

      <div className="w-full bg-secondary-300 rounded-xl p-4">
        <ul className="space-y-1">
          {items.map((item, i) => {
            const Icon = item.icon;
            const isActive = item.isContainsPathname;

            return (
              <Link
                key={i}
                href={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all group cursor-pointer
                  ${isActive ? "bg-[#fefeff]" : "hover:bg-[#fefeff]/90"}
                `}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-primary-700"
                      : "text-primary-600 group-hover:text-primary-700"
                  }`}
                />
                <span
                  className={`font-normal text-md transition-colors ${
                    isActive
                      ? "text-primary-700 font-semibold"
                      : "text-text-primary-200"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default memo(UserLayoutSection);
