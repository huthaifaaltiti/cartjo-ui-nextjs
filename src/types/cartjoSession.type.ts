export interface CartJOSession {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions?: string[];
}
