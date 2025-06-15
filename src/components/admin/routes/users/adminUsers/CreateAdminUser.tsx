import { memo } from "react";
import { getServerSession } from "next-auth";

import { authOptions, CustomSession } from "@/lib/authOptions";
import { ExtendedSession } from "@/types/session";

import CreateAdminUserForm from "./CreateAdminUserForm";

const CreateAdminUser = async () => {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const accessToken = (session as CustomSession)?.accessToken;

  return <CreateAdminUserForm accessToken={accessToken} />;
};

export default memo(CreateAdminUser);
