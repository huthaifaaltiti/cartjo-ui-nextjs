import { UserRole } from "@/enums/user-role.enum";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export default function isAdminClientSide(
  session: CartJOSession | TokenSession | null,
): boolean {
  if (!session) return false;

  const role = session.role.toLowerCase();

  return (
    role === UserRole.ADMINISTRATOR.toLocaleLowerCase() ||
    role === UserRole.OWNER.toLocaleLowerCase()
  );
}
