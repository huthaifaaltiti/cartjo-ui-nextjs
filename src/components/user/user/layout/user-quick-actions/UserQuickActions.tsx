import { memo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, ShoppingBag, Undo2 } from "lucide-react";

type QuickAction = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const UserQuickActions = () => {
  const t = useTranslations();

  const quickActions: QuickAction[] = [
    {
      icon: ShoppingBag,
      label: "orders",
      path: "/orders",
    },
    {
      icon: Undo2,
      label: "returns",
      path: "/returns",
    },
    {
      icon: Heart,
      label: "wishlist",
      path: "/wishlist",
    },
  ];

  return (
    <div className="w-full space-y-2">
      {quickActions.map((quickAction, i) => {
        const Icon = quickAction.icon;

        return (
          <Link
            key={i}
            href={quickAction.path}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fefeff]/90 transition-all group"
          >
            <Icon className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
            <span className="font-normal text-md text-text-primary-200">
              {t(
                `routes.user.layout.components.UserQuickActions.quickActions.${quickAction.label}`
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default memo(UserQuickActions);
