import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMockRegister } from "@/lib/api/useMockRegister";
import type {
  DestinationCountry,
  IELTSMockTestFormData,
  ModulesCompleted,
} from "@/shared/types/mockFormTypes";
import {
  DESTINATION_COUNTRY_OPTIONS,
  MODULE_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  TEST_TYPE_OPTIONS,
} from "@/constant/mock";
import { useNavigate } from "react-router-dom";

// Subcomponents
interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  registerProps?: any;
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, label, required, error, registerProps, ...props }, ref) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        ref={ref}
        {...registerProps}
        {...props}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);

LabeledInput.displayName = "LabeledInput";

interface SelectFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required,
  error,
  children,
}) => (
  <div className="space-y-2">
    <Label>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

interface SelectedModuleTagProps {
  module: ModulesCompleted;
  onRemove: (module: ModulesCompleted) => void;
}

const SelectedModuleTag: React.FC<SelectedModuleTagProps> = ({
  module,
  onRemove,
}) => (
  <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm">
    {module}
    <button
      type="button"
      onClick={() => onRemove(module)}
      className="ml-1 hover:text-destructive transition-colors"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

// Main Component
interface IeltsMockTestFormProps {
  isButton?: boolean;
}
export default function IeltsMockTestForm({ isButton = false }: IeltsMockTestFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const { mutate, isPending } = useMockRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<IELTSMockTestFormData>({
    defaultValues: {
      modulesCompleted: [],
      mockTestDate: "",
    },
  });

  const destinationCountry = watch("destinationCountry");
  // const selectedModules = watch("modulesCompleted");

  const onSubmit = (data: IELTSMockTestFormData) => {
    const apiData = {
      mockTestDate: data.mockTestDate,
      timeSlot: data.timeSlot,
      testType: data.testType,
      modulesCompleted: data.modulesCompleted,
      fullName: data.fullName,
      whatsappNumber: data.whatsappNumber,
      examDate: data.ieltsExamDate || "",
      destinationCountry: (data.destinationCountry === "Other"
        ? data.otherCountry || ""
        : data.destinationCountry) as DestinationCountry,
    };

    mutate(apiData, {
      onSuccess: () => {
        toast.success("Registered successfully");
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          reset();
        }, 3000);
      },
      onError: () => {
        toast.error("Registration failed. Please try again.");
      },
    });
  };

  const handleModuleSelect = (value: ModulesCompleted, field: any) => {
    const currentValue = field.value || [];
    if (!currentValue.includes(value)) {
      field.onChange([...currentValue, value]);
    }
  };

  const handleModuleRemove = (moduleToRemove: ModulesCompleted, field: any) => {
    const newValue = field.value.filter(
      (module: ModulesCompleted) => module !== moduleToRemove
    );
    field.onChange(newValue);
  };

  return (
    <>
    
      {isButton ? (
        <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-200 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      ):null}
      <div className="vh-screen overflow-auto bg-[#E8F6E9] md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className={`shadow-lg ${isButton ? " px-12 py-8" : " px-2 py-8"}`}>
            <CardHeader className={`flex flex-col items-center mb-4 ${isButton ? "" : ""}`}>
              <CardTitle className="text-3xl font-bold text-gray-900">
                IELTS Mock Test Registration
              </CardTitle>
              <CardDescription>
                Please fill out all required fields to register for the mock
                test
              </CardDescription>
            </CardHeader>

            <CardContent>
              {submitted && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Registration submitted successfully!
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Date of Mock Test */}
                <LabeledInput
                  id="mockTestDate"
                  label="Date of Mock Test"
                  required
                  type="date"
                  registerProps={register("mockTestDate", {
                    required: "Date is required",
                  })}
                  error={errors.mockTestDate?.message}
                />

                {/* Preferred Time */}
                <SelectField
                  label="Preferred Time"
                  required
                  error={errors.timeSlot?.message}
                >
                  <Controller
                    control={control}
                    name="timeSlot"
                    rules={{ required: "Please select a preferred time" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full outline-0 cursor-pointer">
                          <SelectValue placeholder="Select a preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          {PREFERRED_TIME_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </SelectField>

                {/* Test Type */}
                <SelectField
                  label="Test Type"
                  required
                  error={errors.testType?.message}
                >
                  <Controller
                    control={control}
                    name="testType"
                    rules={{ required: "Please select a test type" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full cursor-pointer focus:ring-0">
                          <SelectValue placeholder="Select a test type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEST_TYPE_OPTIONS.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </SelectField>

                {/* Module Completed */}
                <SelectField
                  label="Module Completed"
                  required
                  error={errors.modulesCompleted?.message}
                >
                  <Controller
                    control={control}
                    name="modulesCompleted"
                    rules={{
                      required: "Please select at least one module",
                      validate: (value) =>
                        value?.length > 0 ||
                        "Please select at least one module",
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        {/* Selected Modules Display */}
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((module) => (
                              <SelectedModuleTag
                                key={module}
                                module={module}
                                onRemove={(moduleToRemove) =>
                                  handleModuleRemove(moduleToRemove, field)
                                }
                              />
                            ))}
                          </div>
                        )}

                        {/* Module Selector */}
                        <Select
                          value=""
                          onValueChange={(value: ModulesCompleted) =>
                            handleModuleSelect(value, field)
                          }
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select modules" />
                          </SelectTrigger>
                          <SelectContent>
                            {MODULE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                disabled={field.value?.includes(option)}
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </SelectField>

                {/* Basic Info Fields */}
                <LabeledInput
                  id="fullName"
                  label="Full Name"
                  required
                  placeholder="Full Name"
                  registerProps={register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                  error={errors.fullName?.message}
                />

                <LabeledInput
                  id="whatsappNumber"
                  label="WhatsApp Number"
                  required
                  type="tel"
                  placeholder="+977 9800000000"
                  registerProps={register("whatsappNumber", {
                    required: "WhatsApp number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]*$/,
                      message: "Invalid phone number",
                    },
                  })}
                  error={errors.whatsappNumber?.message}
                />

                {/* Optional Fields */}
                <LabeledInput
                  id="ieltsExamDate"
                  label="IELTS Exam Date (If Booked)"
                  type="date"
                  registerProps={register("ieltsExamDate")}
                />

                {/* Destination Country */}
                <SelectField
                  label="Destination Country"
                  required
                  error={errors.destinationCountry?.message}
                >
                  <Controller
                    control={control}
                    name="destinationCountry"
                    rules={{ required: "Please select a destination country" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={
                            errors.destinationCountry
                              ? "border-red-500 w-full cursor-pointer"
                              : "w-full cursor-pointer"
                          }
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {DESTINATION_COUNTRY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </SelectField>

                {/* Other Country Conditional Field */}
                {destinationCountry === "Other" && (
                  <LabeledInput
                    id="otherCountry"
                    label="Please specify country"
                    required
                    placeholder="Enter country name"
                    registerProps={register("otherCountry", {
                      required: "Please specify the country",
                    })}
                    error={errors.otherCountry?.message}
                  />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full cursor-pointer bg-primary/90 hover:bg-primary text-lg py-6 transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
