export interface IUser {
  id: string;
  name: string;
  email: string;
  roleId?: string;
  role?:
    | {
        id: string;
        name: string;
      }
    | string;
  active: boolean;
  status?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  company?: string;
  city?: string;
  state?: string;
  address?: string;
  country?: string;
  zipCode?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
