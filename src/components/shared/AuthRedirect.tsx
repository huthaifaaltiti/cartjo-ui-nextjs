import { useTranslations } from "next-intl";
import CounterDown from "./CounterDown";

interface Props {
  redirectLocation?: string;
}

const AuthRedirect = ({ redirectLocation }: Props) => {
  const t = useTranslations("components.AuthRedirect");

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="mb-3">
        <p className="text-lg font-medium mb-2">{t("title")}</p>
        <p className="text-sm text-gray-500">{t("desc")}</p>
      </div>

      <CounterDown
        startCounting={true}
        countDownAmount={3}
        withRelocation={true}
        withDirMessage={false}
        dirMessage={""}
        relocationPath={redirectLocation ?? ''}
        size="lg"
        color="purple"
        align="center"
      />
    </div>
  );
};

export default AuthRedirect;
