import { useTranslations } from "next-intl";

type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const t = useTranslations();

  return (
    <div className="w-full h-full p-3 flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p className="font-bold">
          {t("components.ErrorMessage.somethingWrong")}
        </p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
