export type createAdminTypes = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  profileImageId: string | null;
  role: string;
};

export type CreateAdminResponse = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
};
