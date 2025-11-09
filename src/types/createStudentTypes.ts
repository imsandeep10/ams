export type createStudentTypes = {
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: "superAdmin" | "admin" | "student" | string;
    profileImageId: string;
  };
  student: {
    gpaOrPercentage: string;
    perferredCountry: string;
    faculty: string;
    classTime: "Morning" | "Afternoon" | "Evening" | string;
    language: string;
    interestedCourse: string;
    academicQualification: string;
    yearOfCompletion: string;
  };
};

export type UploadedImageResponse = {
  id: string;
  createdAt: string; // ISO date string
  filename: string;
  originalName: string;
  mimeType: string;
  path: string;
  size: number;
  type: "image";
  url: string;
};

export type CreateStudentResponse = {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  academicQualification: string;
  yearOfCompletion: string;
  country: string;
  faculty: string;
  classTime: string;
  interestedCourse: string;
  profileImage: string | null;
  gpa: string;
  language: string;
  createdAt: string;
  updatedAt: string;
};
