import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "./authOptions";

/**
 * @returns the access token from the server session using Next-Auth
 * @throws an error if no session or token is found.
 */

export const getAccessTokenFromServerSession = async (): Promise<string> => {
  const session = (await getServerSession(authOptions)) as CustomSession;

  if (!session?.accessToken) throw new Error("Unauthorized user token");

  return session?.accessToken;
};
