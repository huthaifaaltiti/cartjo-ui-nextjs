"use client";

import { memo, useState } from "react";
import { CreditCard, FileText, Package, RefreshCw, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface SupportFAQProps {
  searchQuery: string;
}

const SupportFAQ = ({ searchQuery }: SupportFAQProps) => {
  const t = useTranslations();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    {
      id: "all",
      label: t("routes.support.components.SupportFAQ.categories.all"),
      icon: FileText,
    },
    {
      id: "orders",
      label: t("routes.support.components.SupportFAQ.categories.orders"),
      icon: Package,
    },
    {
      id: "shipping",
      label: t("routes.support.components.SupportFAQ.categories.shipping"),
      icon: Package,
    },
    {
      id: "returns",
      label: t(
        "routes.support.components.SupportFAQ.categories.returnAndRefunds"
      ),
      icon: RefreshCw,
    },
    {
      id: "payment",
      label: t("routes.support.components.SupportFAQ.categories.payment"),
      icon: CreditCard,
    },
    {
      id: "account",
      label: t("routes.support.components.SupportFAQ.categories.account"),
      icon: User,
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: t("routes.support.components.SupportFAQ.faqs.trackOrder.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.trackOrder.a"),
      category: "orders",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.returnPolicy.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.returnPolicy.a"),
      category: "returns",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.shippingTime.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.shippingTime.a"),
      category: "shipping",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.paymentMethods.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.paymentMethods.a"),
      category: "payment",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.updateAccount.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.updateAccount.a"),
      category: "account",
    },
    {
      question: t(
        "routes.support.components.SupportFAQ.faqs.internationalShipping.q"
      ),
      answer: t(
        "routes.support.components.SupportFAQ.faqs.internationalShipping.a"
      ),
      category: "shipping",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.cancelOrder.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.cancelOrder.a"),
      category: "orders",
    },
    {
      question: t("routes.support.components.SupportFAQ.faqs.damagedItem.q"),
      answer: t("routes.support.components.SupportFAQ.faqs.damagedItem.a"),
      category: "returns",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("routes.support.components.SupportFAQ.title")}
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary-600 text-white-50"
                    : "bg-white-50 text-gray-700 border border-gray-300 hover:border-primary-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <details
                key={index}
                className="bg-white-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors group"
              >
                <summary className="cursor-pointer p-6 font-semibold text-gray-900 list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="bg-white-50 rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">
                {t("routes.support.components.SupportFAQ.noResults")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SupportFAQ);
