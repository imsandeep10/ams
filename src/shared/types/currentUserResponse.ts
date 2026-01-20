import type { Role } from "../interface/studentResponse";

export interface CurrentUserResponse {
  data: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    phoneNumber: string;
    profileImage: string | null;
    address: string;
  };
}
