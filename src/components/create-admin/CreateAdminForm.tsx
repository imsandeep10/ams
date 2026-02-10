import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { memo, useCallback, useState, useEffect } from "react";
import {
  createAdminSchema,
  type CreateAdminFormData,
} from "@/schema/createAdminSchema";
import { useUploadImage } from "@/lib/api/useImage";
import {
  useCreateAdmins,
  useGetAdminById,
  useUpdateAdmin,
} from "@/lib/api/useAdmin";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface props {
  mode: "edit" | "create";
}

// Create separate schemas for create and edit
const createAdminSchemaWithPassword = createAdminSchema;
const editAdminSchema = createAdminSchema.omit({ password: true });

// Extract valid roles configuration outside component (rendering-hoist-jsx)
const VALID_ROLES = [
  "satAdmin",
  "duolingoAdmin",
  "ieltsAdmin",
  "pteAdmin",
  "accountant",
] as const;

const ROLE_LABELS: Record<string, string> = {
  satAdmin: "SAT Admin",
  duolingoAdmin: "Duolingo Admin",
  ieltsAdmin: "IELTS Admin",
  pteAdmin: "PTE Admin",
  accountant: "Accountant",
};

// Helper function outside component
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

function CreateAdminFormComponent({ mode }: props) {
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: createAdmins } = useCreateAdmins();
  const { mutateAsync: updateAdmin } = useUpdateAdmin();

  const { id } = useParams<{ id: string }>();
  const { data: adminData, isLoading } = useGetAdminById(id || "");

  const [uploadError, setUploadError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(
      mode === "create" ? createAdminSchemaWithPassword : editAdminSchema,
    ),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      address: "",
      role: "satAdmin", // Default role
      profileImageId: "",
    },
    mode: "onBlur",
  });

  // Populate form with admin data when in edit mode (single effect, no duplicates)
  useEffect(() => {
    if (
      mode === "edit" &&
      adminData?.data &&
      !isLoading &&
      !isFormInitialized
    ) {
      // Use static VALID_ROLES array with proper type assertion
      // const adminRole: (typeof VALID_ROLES)[number] =
      //   adminData?.data.role &&
      //   VALID_ROLES.includes(adminData?.data.role as any)
      //     ? (adminData?.data.role as (typeof VALID_ROLES)[number])
      //     : "satAdmin";

      // Use form.reset() to properly populate all fields and reset form state
      form.reset({
        fullName: adminData?.data.fullName || "",
        email: adminData?.data.email || "",
        phoneNumber: adminData?.data.phoneNumber || "",
        address: adminData?.data.address || "",
        // role: adminRole,
        profileImageId: adminData?.data.profileImageId || "",
        password: "",
      });

      setIsFormInitialized(true);

      // Set preview image if exists
      if (adminData?.data.profileImage?.url) {
        setPreviewImage(adminData?.data.profileImage.url);
      }
    }
  }, [adminData, isLoading, mode, isFormInitialized]);

  const { isSubmitting } = form.formState;

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setUploadError("");

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        const res = await uploadImage(file);
        const imageId = res.id;
        form.setValue("profileImageId", imageId, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return imageId;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.";
        setUploadError(errorMsg);
        form.setValue("profileImageId", "", { shouldValidate: true });
        setPreviewImage("");
        throw error;
      }
    },
    [uploadImage, form, setUploadError, setPreviewImage],
  );

  const handleRemoveImage = useCallback(() => {
    setPreviewImage("");
    form.setValue("profileImageId", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form, setPreviewImage]);

  const onSubmit = useCallback(
    async (values: CreateAdminFormData) => {
      try {
        if (mode === "edit" && id) {
          // For edit mode, remove both password and role as backend doesn't need them
          const { password, role, ...submitData } = values;

          await updateAdmin({ id, data: submitData });
          toast.success("Admin updated successfully!");
        } else {
          await createAdmins(values);
          toast.success("Admin created successfully!");
        }
        // Navigate after successful submission
        navigate("/admins");
      } catch (error: any) {
        console.error("Submit error:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    },
    [createAdmins, updateAdmin, mode, id, navigate],
  );

  // Memoize full name for avatar fallback (rerender-defer-reads)
  const fullName = form.watch("fullName");

  if (mode === "edit" && isLoading) {
    return <div className="p-8">Loading admin data...</div>;
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-200 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 lg:p-16 py-8 rounded-lg shadow-md overflow-hidden h-auto bg-white"
          noValidate
        >
          {/* Header */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {mode === "edit" ? "Edit Admin" : "Create New Admin"}
            </h3>
          </div>

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Phone Number */}
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

          {/* Password - Only show in create mode */}
          {mode === "create" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="transition-colors focus:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Address */}
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

          {/* Role - Optimized Select Component */}
          {mode === "create" && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full transition-colors focus:ring-2">
                        <SelectValue placeholder="Select Role">
                          {field.value
                            ? ROLE_LABELS[field.value]
                            : "Select Role"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VALID_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Profile Image */}
          <div className="md:col-span-2 space-y-4">
            <FormLabel>Profile Image (Optional)</FormLabel>

            {/* Image Preview */}
            {(previewImage ||
              (mode === "edit" && adminData?.data?.profileImage)) && (
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage
                    src={previewImage || adminData?.data?.profileImage?.url}
                    alt="Profile preview"
                  />
                  <AvatarFallback className="text-sm">
                    {getInitials(fullName || "Admin")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}

            {/* File Input */}
            <FormField
              control={form.control}
              name="profileImageId"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await handleImageUpload(file);
                          } catch (error) {
                            // Error handled in handleImageUpload
                            console.error("Image upload error:", error);
                          }
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium transition-colors disabled:opacity-50"
                    />
                  </FormControl>
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-2">
                      Uploading image...
                    </p>
                  )}
                  {uploadError && (
                    <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full py-3 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Submitting..."
                : isUploading
                  ? "Uploading..."
                  : mode === "edit"
                    ? "Update Admin"
                    : "Create Admin"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export const CreateAdminForm = memo(CreateAdminFormComponent);
