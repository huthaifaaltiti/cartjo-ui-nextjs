"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { memo } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      {session ? (
        <>
          <h1>Welcome back, {session.user?.email}!</h1>
          <div className="space-y-2">
            <button
              onClick={() => signOut({ callbackUrl: "/en/auth" })}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <p>
            Please go to{" "}
            <Link href="/en/auth" className="text-blue-500 underline">
              /auth
            </Link>{" "}
            to login
          </p>
        </>
      )}
    </>
  );
};

export default memo(Dashboard);
