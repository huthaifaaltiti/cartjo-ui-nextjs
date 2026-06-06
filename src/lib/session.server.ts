import { TOKEN_KEYS } from "@/constants/tokenKeys.constants";
import { UserRole } from "@/enums/user-role.enum";
import { CartJOSession } from "@/types/cartjoSession.type";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "./apiEndpoints";

function decodeAccessToken(token: string): CartJOSession | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const payload = JSON.parse(
      Buffer.from(base64, "base64url").toString("utf-8"),
    );

    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      permissions: payload.permissions,
    };
  } catch {
    return null;
  }
}

async function fetchSession(
  accessToken: string,
): Promise<CartJOSession | null> {
  try {
    const res = await fetch(API_ENDPOINTS.USER.GET_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const decodedSessionFromToken = decodeAccessToken(accessToken);
      return decodedSessionFromToken || null;
    }

    const json = await res.json();

    return json?.data ?? null;
  } catch (err) {
    console.error("Failed to fetch session:", err);
    return null;
  }
}

export async function getSession(): Promise<CartJOSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(TOKEN_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) return null;

  return fetchSession(accessToken);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();

  if (!session) return false;

  const role = session.role.toLowerCase();

  return (
    role === UserRole.ADMINISTRATOR.toLocaleLowerCase() ||
    role === UserRole.OWNER.toLocaleLowerCase()
  );
}

export function checkIsAdmin(session: CartJOSession | null): boolean {
  if (!session) return false;

  const role = session.role.toLowerCase();

  return (
    role === UserRole.ADMINISTRATOR.toLocaleLowerCase() ||
    role === UserRole.OWNER.toLocaleLowerCase()
  );
}
