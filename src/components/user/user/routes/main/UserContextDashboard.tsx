"use client";

import ErrorMessage from "@/components/shared/ErrorMessage";
import {
  PreferredLanguage,
  PreferredLanguageKey,
} from "@/constants/preferredLanguage.constant";
import { useUserContextQuery } from "@/hooks/react-query/useUserContextQuery";
import { RootState } from "@/redux/store";
import { Loader2, ShoppingCart, Heart, User, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";

const UserContextDashboard = () => {
  const t = useTranslations("routes.user.components.UserContextDashboard");

  const { data, isLoading, isError, error } = useUserContextQuery();
  const { isArabic } = useSelector((state: RootState) => state.general);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.message || t("errorUnknown")} />;
  }

  const userContext = data?.data;

  if (!userContext) {
    return (
      <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">{t("noData")}</p>
      </div>
    );
  }

  const { firstName, lastName, counters, dateJoined, preferredLang } =
    userContext;

  return (
    <div className="w-full space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{t("welcomeTitle")}</h1>
        <p className="text-gray-600">{t("welcomeBack")}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t("wishlistItems")}</p>
              <p className="text-3xl font-bold text-blue-600">
                {counters?.wishlistItemsCount || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{t("cartItems")}</p>
              <p className="text-3xl font-bold text-green-600">
                {counters?.cartItemsCount || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("accountInfoTitle")}</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t("fullName")}</p>
              <p className="font-medium">
                {firstName} {lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t("memberSince")}</p>
              <p className="font-medium">
                {new Date(dateJoined).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">
              🌐
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("preferredLang")}</p>
              <p className="font-medium uppercase">
                {
                  PreferredLanguage[
                    preferredLang?.toUpperCase() as PreferredLanguageKey
                  ][isArabic ? "labelAr" : "labelEn"]
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContextDashboard;
