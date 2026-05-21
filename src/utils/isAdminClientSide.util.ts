import { UserRole } from "@/enums/user-role.enum";
import { CartJOSession } from "@/types/cartjoSession.type";

export default function isAdminClientSide(
  session: CartJOSession | null,
): boolean {
  if (!session) return false;

  const role = session.role.toLowerCase();

  return (
    role === UserRole.ADMINISTRATOR.toLocaleLowerCase() ||
    role === UserRole.OWNER.toLocaleLowerCase()
  );
}
