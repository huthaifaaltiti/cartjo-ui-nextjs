import { KeyRound, Mail, Phone, User } from "lucide-react";
import { memo, useState } from "react";

const IdentifyAccount = () => {
  const [identifierType, setIdentifierType] = useState<string>("email");
  const [identifier, setIdentifier] = useState("");

  const detectIdentifierType = (value) => {
    if (value.includes("@")) return "email";
    if (/^\+?[\d\s-()]+$/.test(value)) return "phone";
    return "username";
  };

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    if (value) {
      setIdentifierType(detectIdentifierType(value));
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-blue-600" />
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
};

export default memo(IdentifyAccount);
