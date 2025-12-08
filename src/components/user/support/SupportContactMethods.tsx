import { memo } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, Clock, Mail, Phone } from "lucide-react";

const SupportContactMethods = () => {
  const t = useTranslations();

  const contactMethods = [
    // {
    //   icon: MessageCircle,
    //   title: "Live Chat",
    //   description: "Chat with our support team",
    //   availability: "Available 24/7",
    //   action: () => console.log("Open live chat"),
    //   available: true,
    // },
    {
      icon: Mail,
      title: t(
        "routes.support.components.contactSection.contactMethods.email.title"
      ),
      description: "support@yourstore.com",
      availability: t(
        "routes.support.components.contactSection.contactMethods.email.availability"
      ),
      action: () => (window.location.href = "mailto:support@yourstore.com"),
      available: true,
    },
    {
      icon: Phone,
      title: t(
        "routes.support.components.contactSection.contactMethods.phone.title"
      ),
      description: "+1 (555) 123-4567",
      availability: t(
        "routes.support.components.contactSection.contactMethods.phone.availability"
      ),
      action: () => (window.location.href = "tel:+15551234567"),
      available: false,
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("routes.support.components.contactSection.title")}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <button
              key={index}
              onClick={method.action}
              className="bg-white-50 p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                {method.available ? (
                  <span className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t("general.status.online")}
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {t("general.status.offline")}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-2">{method.description}</p>
              <p className="text-sm text-gray-500">{method.availability}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(SupportContactMethods);
