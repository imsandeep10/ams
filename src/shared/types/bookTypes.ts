export type bookInfo = {
 id: string;
 user:{
    fullName: string;
    email: string;
    phoneNumber: string;
 },
 payment: {
      bookStatus: string;
      id: string;
 };
};