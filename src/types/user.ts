export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  usernameUpdatedAt: string | null;
  email: string;
  countryCode: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  password: string;
  rememberMe: boolean;
  role: "Owner" | "Administrator" | "User";
  canManage: boolean;
  isActive: boolean;
  isDeleted: boolean;
  permissions: string[];
  createdBy: string;
  termsAccepted: boolean;
  marketingEmails: boolean;
  dateJoined: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
