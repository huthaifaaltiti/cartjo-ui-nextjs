import { TOKEN_KEYS } from "@/constants/tokenKeys.constants";
import { UserRole } from "@/enums/user-role.enum";
import { CartJOSession } from "@/types/cartjoSession.type";
import { cookies } from "next/headers";

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

export async function getSession(): Promise<CartJOSession | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(TOKEN_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) return null;

  return decodeAccessToken(accessToken);
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
