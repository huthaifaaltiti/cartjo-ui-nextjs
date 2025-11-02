"use client";

import { memo } from "react";
import { Stepper } from "@/components/ui/stepper";
import IdentifyAccount from "./IdentifyAccount";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import VerifyCode from "./VerifyCode";
import { setStep } from "@/redux/slices/auth/forgotPassword";
import { useTranslations } from "next-intl";
import CreateNewPassword from "./CreateNewPassword";

const ForgotPasswordStepper = () => {
  const t = useTranslations(
    "routes.auth.routes.forgotPassword.components.ForgotPasswordStepper"
  );

  const dispatch = useDispatch<AppDispatch>();
  const { currentStep } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const steps = [
    {
      title: t("steps._1.title"),
      description: t("steps._1.desc"),
      component: <IdentifyAccount />,
    },
    {
      title: t("steps._2.title"),
      description: t("steps._1.desc"),
      component: <VerifyCode />,
    },
    {
      title: t("steps._3.title"),
      description: t("steps._1.desc"),
      component: <CreateNewPassword />,
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-center text-gray-600">{t("desc")}</p>
        </div>

        <div className="bg-white-50 rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={(step) => dispatch(setStep(step))}
            prevBtnLabel={""}
            nextBtnLabel={""}
            finishHint={""}
            isNextBtnDisabled={false}
            isPrevBtnDisabled={false}
            hideBtns={true}
          />
        </div>

        <div className="bg-white-50 rounded-2xl shadow-lg p-6 md:p-10 flex-1 flex flex-col justify-center">
          {steps[currentStep].component}
        </div>
      </div>
    </div>
  );
};

export default memo(ForgotPasswordStepper);
