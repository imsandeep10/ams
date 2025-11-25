import {
  createStudentFormSchema,
  type CreateStudentFormData,
} from "@/schema/createStudentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { memo, useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  academicQualifications,
  Countries,
  Languages,
  qualificationYear,
} from "@/constant/Students";
import { useUploadImage } from "@/lib/api/useImage";
import {
  useCreateStudents,
  useGetStudentById,
  useUpdateStudent,
} from "@/lib/api/useStudents";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { TimeSelector } from "../ui/time-selector";

interface props {
  mode: "edit" | "create";
}

function StudentRegister({ mode }: props) {
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: createStudents } = useCreateStudents();
  const { mutateAsync: updateStudent } = useUpdateStudent();

  const { id } = useParams<{ id: string }>();
  const { data: StudentData } = useGetStudentById(id || "");

  const [uploadError, setUploadError] = useState<string>("");
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const pathLanguage = searchParam.get("language");

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      profileImageId: "",
      gpaOrPercentage: "",
      preferredCountry: "",
      faculty: "",
      classTime: "",
      language: pathLanguage || "",
      interestedCourse: "",
      academicQualification: "",
      yearOfCompletion: "",
    },
    mode: "onBlur",
  });

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (mode === "edit" && StudentData) {
      const formData: CreateStudentFormData = {
        fullName: StudentData.user?.fullName || StudentData.name || "",
        email: StudentData.user?.email || StudentData.email || "",
        phoneNumber: StudentData.user?.phoneNumber || StudentData.phone || "",
        address: StudentData.user?.address || "",
        profileImageId:
          StudentData.user?.profileImage?.id ||
          StudentData.user?.profileImageId ||
          "",
        gpaOrPercentage: StudentData.gpaOrPercentage || "",
        preferredCountry: StudentData.preferredCountry || "",
        faculty: StudentData.faculty || "",
        classTime: StudentData.classTime || "",
        language: StudentData.language || "",
        interestedCourse: StudentData.interestedCourse || "",
        academicQualification: StudentData.academicQualification || "",
        yearOfCompletion: StudentData.yearOfCompletion || "",
      };

      form.reset(formData, { keepDefaultValues: false });

      if (formData.profileImageId) {
        form.setValue("profileImageId", formData.profileImageId, {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    }
  }, [StudentData, mode]);

  const { isSubmitting, isDirty } = form.formState;

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setUploadError("");
        const res = await uploadImage(file);
        const imageId = res.id;

        form.setValue("profileImageId", imageId, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return imageId;
      } catch (error) {
        setUploadError("Failed to upload image. Please try again.");
        form.setValue("profileImageId", "", { shouldValidate: true });
        throw error;
      }
    },
    [uploadImage, form]
  );

  const onSubmit = useCallback(
    async (values: CreateStudentFormData) => {
      try {
        if (mode === "edit" && id) {
          // Update existing student
          await updateStudent({ id, data: values });
        } else {
          // Create new student
          await createStudents(values);
        }

        navigate("/success-message");
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    },
    [createStudents, updateStudent, mode, id, pathLanguage]
  );

  return (
    <>
      <div className=" overflow-auto h-screen p-5">
        <h2 className="text-4xl font-semibold py-8 text-center text-primary">
          Register Student
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 lg:p-6 py-8 rounded-lg shadow-md overflow-hidden h-auto"
            noValidate
          >
            {/* User Fields */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="9800000000"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImageId"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Image <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/png, image/jpeg"
                      disabled={isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await handleImageUpload(file);
                          } catch (error) {}
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium transition-colors disabled:opacity-50"
                    />
                  </FormControl>
                  {isUploading && (
                    <p className="text-sm text-blue-600">Uploading image...</p>
                  )}
                  {uploadError && (
                    <p className="text-sm text-red-600">{uploadError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Student Fields */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-2">
                Academic Information
              </h3>
            </div>

            <FormField
              control={form.control}
              name="academicQualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Qualification</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full transition-colors focus:ring-2">
                        <SelectValue placeholder="Select Qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicQualifications.map((qualification) => (
                          <SelectItem key={qualification} value={qualification}>
                            {qualification}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearOfCompletion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Completion</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full transition-colors focus:ring-2">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualificationYear.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gpaOrPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3.5"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Country</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full transition-colors focus:ring-2">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {Countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Science, Management, etc."
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Time</FormLabel>
                  <FormControl>
                    <TimeSelector
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full transition-colors focus:ring-2">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {Languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestedCourse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interested Course <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your interested course"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full py-3 cursor-pointer font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  isSubmitting || isUploading || (mode === "edit" && !isDirty)
                }
              >
                {isSubmitting
                  ? mode === "edit"
                    ? "Updating..."
                    : "Submitting..."
                  : isUploading
                  ? "Uploading..."
                  : mode === "edit"
                  ? "Update Student"
                  : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export const StudentRegisterForm = memo(StudentRegister);
