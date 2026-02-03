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
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import {
  createAdminSchema,
  type CreateAdminFormData,
} from "@/schema/createAdminSchema";
import { useUploadImage } from "@/lib/api/useImage";
import { useCreateAdmins } from "@/lib/api/useAdmin";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

function CreateAdminFormComponent() {
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: createAdmins } = useCreateAdmins();
  const [uploadError, setUploadError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      address: "",
      role: "satAdmin",
      profileImageId: "",
    },
    mode: "onBlur",
  });

  const { isSubmitting } = form.formState;
  const fullName = form.watch("fullName");

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setUploadError("");
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        const res = await uploadImage(file);
        form.setValue("profileImageId", res.id, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return res.id;
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
    [uploadImage, form],
  );

  const handleRemoveImage = useCallback(() => {
    setPreviewImage("");
    form.setValue("profileImageId", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form]);

  const onSubmit = useCallback(
    async (values: CreateAdminFormData) => {
      try {
        await createAdmins(values);
        toast.success("Admin created successfully!");
        navigate("/admins");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    },
    [createAdmins, navigate],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new administrator to the system
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="focus-visible:ring-2 transition-colors"
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
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                          className="focus-visible:ring-2 transition-colors"
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
                      <FormLabel>
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="9800000000"
                          {...field}
                          className="focus-visible:ring-2 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          {...field}
                          className="focus-visible:ring-2 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                          className="focus-visible:ring-2 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-2 transition-colors">
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
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <FormLabel>Profile Image (Optional)</FormLabel>

                {previewImage && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-16 w-16 border-2">
                      <AvatarImage
                        src={previewImage}
                        alt="Profile preview"
                        loading="lazy"
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 focus-visible:ring-2"
                    >
                      <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="profileImageId"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                await handleImageUpload(file);
                              } catch (error) {
                                console.error("Image upload error:", error);
                              }
                            }
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-colors disabled:opacity-50"
                        />
                      </FormControl>
                      {isUploading && (
                        <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                          Uploading image…
                        </p>
                      )}
                      {uploadError && (
                        <p className="text-sm text-red-600 mt-2">
                          {uploadError}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting
                    ? "Creating…"
                    : isUploading
                      ? "Uploading…"
                      : "Create Admin"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export const CreateAdminForm = memo(CreateAdminFormComponent);
