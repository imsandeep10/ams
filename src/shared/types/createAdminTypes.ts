import type { Role } from "../interface/studentResponse";

export type createAdminTypes = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  profileImageId: string | null;
  role: Role;
};

export type CreateAdminResponse = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
};
