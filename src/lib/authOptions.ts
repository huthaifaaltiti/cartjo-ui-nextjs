import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { API_ENDPOINTS } from "./apiEndpoints";

export interface CustomUser {
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
  canManage: boolean;

  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;

  firstName: string;
  lastName: string;
}

export interface CustomSession extends Session {
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
  refreshToken?: string;
  accessTokenExpires: number;

  userId: string;
  email: string;
  phoneNumber: string;
  role: string;
  firstName: string;
  lastName: string;
  canManage: boolean;

  error?: "RefreshAccessTokenError";
}

async function refreshAccessToken(token: CustomJWT) {
  console.log("Refreshing with token:", token.refreshToken);

  try {
    const res = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json();

    console.log("Refresh response:", data);

    if (!res.ok) throw data;

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      // accessTokenExpires: Date.now() + data.expiresIn * 1000,
      accessTokenExpires: Date.now() + data.expiresIn * 1000, // use backend-provided TTL
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      // credentials: {
      //   token: { label: "Token", type: "text" },
      // },
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        expiresIn: { label: "Expires In", type: "text" },
      },
      async authorize(credentials) {
        // if (!credentials?.token) {
        //   return null;
        // }

        if (
          !credentials?.accessToken ||
          !credentials?.refreshToken ||
          !credentials?.expiresIn
        ) {
          return null;
        }

        try {
          // Verify the token by decoding it or making an API call
          // For now, we'll just decode the JWT to get user info
          // const tokenPayload = JSON.parse(
          //   Buffer.from(credentials.token.split(".")[1], "base64").toString(),
          // );
          const tokenPayload = JSON.parse(
            Buffer.from(
              credentials.accessToken.split(".")[1],
              "base64",
            ).toString(),
          );

          // You can also make an API call to verify the token:
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/auth/verify`, {
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

            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            expiresIn: Number(credentials.expiresIn) ?? 900,
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
    async jwt({ token, user }) {
      const customToken = token as CustomJWT;

      // First login → store tokens
      if (user) {
        console.log("JWT: first login");
        const customUser = user as CustomUser;

        customToken.accessToken = customUser.accessToken!;
        customToken.refreshToken = customUser.refreshToken!;
        // customToken.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1h or parse from JWT
        // ⚡ Use backend-provided expiresIn
        customToken.accessTokenExpires =
          Date.now() + customUser.expiresIn! * 1000;

        customToken.userId = customUser.id;
        customToken.email = customUser.email;
        customToken.phoneNumber = customUser.phoneNumber;
        customToken.role = customUser.role;
        customToken.firstName = customUser.firstName;
        customToken.lastName = customUser.lastName;
        customToken.canManage = customUser.canManage;

        console.log({ customToken });

        return customToken;
      }

      const now = Date.now();
      const buffer = 30 * 1000; // 30 seconds
      // Token still valid
      console.log(Date.now() < customToken.accessTokenExpires);
      if (now < customToken.accessTokenExpires - buffer) {
        console.log("JWT: token still valid (with buffer)");
        console.log({ customToken });
        return customToken;
      }

      // Token expired → refresh
      console.log("JWT: token expired → refreshing 🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰");
      return await refreshAccessToken(customToken);
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
