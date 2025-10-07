import { Session } from "next-auth";

export type ExtendedSession = Session & {
  accessToken: string;
  user: {
    id?: string | null;
    phoneNumber?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    firstName?: string;
    lastName?: string;
    canManage?: boolean;
  };
};
