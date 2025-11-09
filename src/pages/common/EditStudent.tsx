import { CreateStudentForm } from "@/components/students/StudentForm";
import React from "react";

export const EditStudent = React.memo(() => {
  return (
    <>
      <div>
        <CreateStudentForm mode="edit" />
      </div>
    </>
  );
});
EditStudent.displayName = "EditStudent";
