export interface Student {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  email: string;
  image?: string; // optional student image
  classTime: string;
  registrationDate?: string; // optional registration date
  attendanceStatus?: "Present" | "Absent"; // optional attendance status
  faculty: string;
  gpaOrPercentage: string;
  academicQualification: string;
  yearOfCompletion: string;
  interestedCourse: string;
  preferredCountry: string;
  language: string;

  user: {
    id: string
    address: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  }; // optional related user details
}
