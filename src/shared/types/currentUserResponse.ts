import type { Role } from "../interface/studentResponse";

export interface CurrentUserResponse {
  data: any;
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phoneNumber: string;
  profileImage: string | null;
}
