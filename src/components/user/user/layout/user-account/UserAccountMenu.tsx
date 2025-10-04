import { memo } from "react";
import UserLayoutSection, { UserLayoutSectionItem } from "../UserLayoutSection";
import { useTranslations } from "next-intl";
import { CreditCard, HandCoins, MapPin, User } from "lucide-react";

const UserAccountMenu = () => {
  const t = useTranslations();

  const quickActions: UserLayoutSectionItem[] = [
    {
      icon: User,
      label: t("routes.user.layout.components.UserAccountMenu.items.profile"),
      path: "/orders",
    },
    {
      icon: MapPin,
      label: t("routes.user.layout.components.UserAccountMenu.items.addresses"),
      path: "/returns",
    },
    {
      icon: HandCoins,
      label: t("routes.user.layout.components.UserAccountMenu.items.payments"),
      path: "/returns",
    },
    {
      icon: CreditCard,
      label: t(
        "routes.user.layout.components.UserAccountMenu.items.digitalCards"
      ),
      path: "/wishlist",
    },
  ];

  return (
    <UserLayoutSection
      header={t("routes.user.layout.components.UserAccountMenu.header")}
      items={quickActions}
    />
  );
};
export default memo(UserAccountMenu);
