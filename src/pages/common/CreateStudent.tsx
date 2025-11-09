import { CreateStudentForm } from "@/components/students/StudentForm";
import React from "react";

export const CreateStudent = React.memo(() => {
  return (
    <>
      <CreateStudentForm mode="create" />
    </>
  );
});
CreateStudent.displayName = "CreateStudent";
