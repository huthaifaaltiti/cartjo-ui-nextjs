"use client";

import { memo, useState } from "react";
import { Stepper } from "@/components/ui/stepper";
import { Mail, Phone, User, Lock, KeyRound, CheckCircle2 } from "lucide-react";

const ForgotPasswordStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [identifier, setIdentifier] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [identifierType, setIdentifierType] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const detectIdentifierType = (
    value: string | number
  ): "email" | "phone" | "username" => {
    const strValue = String(value).trim();

    if (strValue.includes("@")) return "email";
    if (/^\+?[\d\s-()]+$/.test(strValue)) return "phone";
    return "username";
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);

    if (value) {
      setIdentifierType(detectIdentifierType(value));
    }
  };

  const validateStep1 = () => {
    if (!identifier.trim()) {
      setErrors({ identifier: "Please enter your email, phone, or username" });
      return false;
    }

    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setErrors({ code: "Please enter the 6-digit verification code" });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = async () => {
    setIsLoading(true);

    let isValid = false;
    if (currentStep === 0) isValid = validateStep1();
    else if (currentStep === 1) isValid = validateStep2();
    else if (currentStep === 2) isValid = validateStep3();

    if (isValid) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - handle password reset completion
        alert("Password reset successful! Redirecting to login...");
      }
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const Step1Component = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email, phone number, or username to receive a verification
          code
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email, Phone or Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {identifierType === "email" && (
                <Mail className="h-5 w-5 text-gray-400" />
              )}
              {identifierType === "phone" && (
                <Phone className="h-5 w-5 text-gray-400" />
              )}
              {identifierType === "username" && (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="Enter your email, phone or username"
              className={`w-full pl-10 pr-4 py-3 border ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            />
          </div>
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white-50 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
          ) : (
            "Send Verification Code"
          )}
        </button>
      </div>
    </div>
  );

  const Step2Component = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Verify Your Identity</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to{" "}
          <span className="font-medium text-gray-900">{identifier}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            maxLength={6}
            className={`w-full px-4 py-3 border ${
              errors.code ? "border-red-500" : "border-gray-300"
            } rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
          )}
        </div>

        <div className="text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Didn't receive the code? Resend
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white-50 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Verify Code"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const Step3Component = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold">Create New Password</h2>
        <p className="text-gray-600">
          Choose a strong password to secure your account
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={`w-full px-4 py-3 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={`w-full px-4 py-3 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {newPassword && confirmPassword && newPassword === confirmPassword && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Passwords match</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white-50 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      title: "Identify Account",
      description: "Enter your credentials",
      component: <Step1Component />,
    },
    {
      title: "Verify Code",
      description: "Check your email or phone",
      component: <Step2Component />,
    },
    {
      title: "New Password",
      description: "Create a secure password",
      component: <Step3Component />,
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Password Recovery
          </h1>
          <p className="text-center text-gray-600">
            Follow the steps to reset your password securely
          </p>
        </div>

        <div className="bg-white-50 rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            prevBtnLabel={"Previous"}
            nextBtnLabel={"Next"}
            finishHint={"Finish"}
            isNextBtnDisabled={true}
            isPrevBtnDisabled={false}
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
