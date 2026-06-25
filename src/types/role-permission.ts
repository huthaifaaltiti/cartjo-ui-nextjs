import { UserRole } from "@/enums/user-role.enum";

export interface RolePermission {
  role: UserRole;
  permissions: string[];
}
