import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface CustomUser {
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
  canManage: boolean;
  accessToken: string;
  firstName: string;
  lastName: string;
}

interface CustomSession extends Session {
  accessToken: string;
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    role: string;
    firstName: string;
    lastName: string;
    canManage: boolean;
  };
}

interface CustomJWT extends JWT {
  accessToken: string;
  userId: string;
  email: string;
  phoneNumber: string;
  role: string;
  firstName: string;
  lastName: string;
  canManage: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          return null;
        }

        try {
          // Verify the token by decoding it or making an API call
          // For now, we'll just decode the JWT to get user info
          const tokenPayload = JSON.parse(
            Buffer.from(credentials.token.split(".")[1], "base64").toString()
          );

          // You can also make an API call to verify the token:
          // const response = await fetch(`${process.env.API_URL}/auth/verify`, {
          //   headers: { Authorization: `Bearer ${credentials.token}` }
          // });
          // if (!response.ok) return null;
          // const user = await response.json();

          return {
            id: tokenPayload.userId,
            email: tokenPayload.email,
            phoneNumber: tokenPayload.phoneNumber,
            role: tokenPayload.role,
            canManage: tokenPayload.canManage,
            firstName: tokenPayload.firstName,
            lastName: tokenPayload.lastName,
            accessToken: credentials.token,
          } as CustomUser;
        } catch (error) {
          console.error("Token verification failed:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXT_AUTH_SESSION_MAX_AGE),
  },
  callbacks: {
    // token, user, account, profile, trigger, isNewUser, session
    async jwt({ token, user }) {
      // First time JWT callback is run, user object is available
      if (user) {
        const customToken = token as CustomJWT;
        // Type guard to check if user has our custom properties
        const customUser = user as CustomUser;

        if (customUser.accessToken) {
          customToken.accessToken = customUser.accessToken;
          customToken.userId = customUser.id;
          customToken.email = customUser.email;
          customToken.phoneNumber = customUser.phoneNumber;
          customToken.role = customUser.role;
          customToken.firstName = customUser.firstName;
          customToken.lastName = customUser.lastName;
          customToken.canManage = customUser.canManage;
        }
        return customToken;
      }
      return token;
    },
    // session, token, user
    async session({ session, token }) {
      // Send properties to the client
      const customToken = token as CustomJWT;
      const customSession = session as CustomSession;

      customSession.accessToken = customToken.accessToken;
      customSession.user = {
        id: customToken.userId,
        email: customToken.email,
        phoneNumber: customToken.phoneNumber,
        role: customToken.role,
        firstName: customToken.firstName,
        lastName: customToken.lastName,
        canManage: customToken.canManage,
      };
      return customSession;
    },
  },
  pages: {
    signIn: "/en/auth",
    signOut: "/en/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add debug mode to see what's happening
  debug: process.env.NEXT_PUBLIC_ENV_TYPE === "development",
};
