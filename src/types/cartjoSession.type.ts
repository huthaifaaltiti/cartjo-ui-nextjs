export interface VerificationChannel {
  channel: string;
  verifiedAt: string;
  externalId: string | null;
}

export interface CartJOSession {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  usernameUpdatedAt: string | null;
  profilePic: string | null;
  email: string;
  countryCode: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  passwordChangeAttempts: number;
  lockUntil: string | null;
  rememberMe: boolean;
  role: string;
  gender: string;
  preferredLang: string;
  canManage: boolean;
  isActive: boolean;
  isDeleted: boolean;
  permissions: string[];
  deletedBy: string | null;
  unDeletedBy: string | null;
  createdBy: string;
  termsAccepted: boolean;
  marketingEmails: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpires: string | null;
  isEmailVerified: boolean;
  passwordHistory: string[];
  dateJoined: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  authProvider: string;
  verificationChannels: VerificationChannel[];
  lastLogin: string;
  loginAttempts: number;
  birthDate: string;
  nationality: string;
}
