import { Session } from "next-auth";

export type ExtendedSession = Session & {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    firstName?: string;
    lastName?: string;
    canManage?: boolean;
  };
};
