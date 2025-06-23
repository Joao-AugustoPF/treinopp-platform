export enum Role {
  OWNER = 'OWNER',
  TRAINER = 'TRAINER',
  USER = 'USER',
  SUPPORT = 'SUPPORT',
}

export interface IAccount {
  Id: string;
  UserId: string;
  Name: string;
  Email: string;
  Cpf: string;
  AvatarUrl?: string | File | null;
  Role: Role;
  PhoneNumber?: string;
  BirthDate?: string;
  // Stats
  StatsWorkouts: number;
  StatsClasses: number;
  StatsAchievements: number;
  // Preferences
  PrefNotifications: boolean;
  PrefEmailUpdates: boolean;
  PrefDarkMode: boolean;
  PrefOfflineMode: boolean;
  PrefHapticFeedback: boolean;
  PrefAutoUpdate: boolean;
  PrefLanguage: string;
  // Privacy
  PrivacyPublicProfile: boolean;
  PrivacyShowWorkouts: boolean;
  PrivacyShowProgress: boolean;
  PrivacyTwoFactorAuth: boolean;
  PrivacyShowClasses: boolean;
  PrivacyShowEvaluation: boolean;
  PrivacyShowNotificationIcon: boolean;
  // Address
  AddressStreet?: string;
  AddressNumber?: string;
  AddressComplement?: string;
  AddressNeighborhood?: string;
  AddressCity?: string;
  AddressState?: string;
  AddressZip?: string;
  // Tenant
  TenantId: string;
}

export interface IAccountListResponse {
  Data: {
    Accounts: IAccount[];
    Total: number;
  };
}

export interface IAccountResponse {
  Data: IAccount;
}

export interface IAccountTableFilters {
  Search: string;
  Role: string | null;
  TenantId?: string;
}

export type AccountCreateSchemaType = Omit<
  IAccount,
  '$id' | 'UserId' | 'StatsWorkouts' | 'StatsClasses' | 'StatsAchievements'
>;
