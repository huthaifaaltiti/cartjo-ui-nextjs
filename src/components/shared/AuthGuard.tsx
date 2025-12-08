"use client";

import { useAuthContext } from "@/hooks/useAuthContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isSessionLoading } = useAuthContext();

  if (isSessionLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-center">
        Please log in to view your cart.
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
