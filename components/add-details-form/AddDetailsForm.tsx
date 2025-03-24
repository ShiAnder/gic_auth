"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader } from "lucide-react";
import axios from "axios";

interface AddDetailsFormProps {
  label: string;
  user: {
    id: string;
  };
}

interface FormData {
  province?: string;
  district?: string;
  institution?: string;
  website?: string;
  name?: string;
  designation?: string;
  email?: string;
  contact?: string;
  organizationLogo?: FileList;
  professionalPhoto?: FileList;
  services: {
    serviceName: string;
    category: string;
    description: string;
    requirements: string;
  }[];
}

export const AddDetailsForm = ({ label, user }: AddDetailsFormProps) => {
  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      services: [{ serviceName: "", category: "", description: "", requirements: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success?: boolean; message?: string }>({});

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  const provinceDistricts: Record<string, string[]> = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Hambantota", "Matara"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  };

  useEffect(() => {
    if (selectedProvince && provinceDistricts[selectedProvince]) {
      setDistricts(provinceDistricts[selectedProvince]);
      setValue("district", ""); // Reset district selection
    } else {
      setDistricts([]);
      setValue("district", "");
    }
  }, [selectedProvince, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitResult({});

      const response = await axios.post('/api/organization', {
        organizationData: {
          name: data.institution || "",
          address: data.district || "",
          contactNumber: data.contact || "",
          email: data.email || "",
          website: data.website || "",
          district: data.district || "",
          category: "Default Category",
          userId: user.id,
        },
        servicesData: data.services,
      });

      const result = await response.data;

      if (result.success) {
        setSubmitResult({ success: true, message: "Data saved successfully!" });
      } else {
        setSubmitResult({ success: false, message: result.error || "Error saving data." });
      }
    } catch (error) {
      setSubmitResult({ success: false, message: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-700">{label}</h1>
        </CardHeader>
        <CardContent>
          {submitResult.message && (
            <div className={`p-4 mb-4 rounded-md ${submitResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{submitResult.message}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <select {...register("province")} className="border p-2 rounded w-full">
                <option value="">Select Province</option>
                {Object.keys(provinceDistricts).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>

              <select {...register("district")} className="border p-2 rounded w-full" disabled={!selectedProvince}>
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            
              <input {...register("institution")} placeholder="Institution Name" className="border p-2 rounded" />
              <input {...register("website")} placeholder="Website URL" className="border p-2 rounded" />
            </div>

          {/* Personal Details */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input {...register("name")} placeholder="Your Name" className="border p-2 rounded" />
              <input {...register("designation")} placeholder="Designation" className="border p-2 rounded" />
              <input {...register("email")} type="email" placeholder="Email" className="border p-2 rounded" />
              <input {...register("contact")} placeholder="Contact Number" className="border p-2 rounded" />
            </div>
          </section>

          {/* Upload Organization Logo */}
          <section>
            <h2 className="text-lg font-semibold">Upload Organization Logo</h2>
            <input
              type="file"
              {...register("organizationLogo")}
              className="border p-2 rounded w-full"
              accept="image/*"
            />
          </section>

          {/* Upload Your Image (Professional Photo) */}
          <section>
            <h2 className="text-lg font-semibold">Upload Your Image (Professional Photo)</h2>
            <input
              type="file"
              {...register("professionalPhoto")}
              className="border p-2 rounded w-full"
              accept="image/*"
            />
          </section>

          {/* Service Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Service Information</h2>

            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md space-y-3 bg-gray-100">
                {/* Service Fields */}
                <input
                  {...register(`services.${index}.serviceName`)}
                  placeholder="Service Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  {...register(`services.${index}.category`)}
                  placeholder="Category"
                  className="border p-2 rounded w-full"
                />
                <textarea
                  {...register(`services.${index}.description`)}
                  placeholder="Description"
                  className="border p-2 rounded w-full"
                  rows={3}
                ></textarea>
                <textarea
                  {...register(`services.${index}.requirements`)}
                  placeholder="Requirements"
                  className="border p-2 rounded w-full"
                  rows={3}
                ></textarea>

                {/* Remove Button */}
                {index > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => remove(index)}
                    >
                      ✖ Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Another Service Button */}
            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() =>
                append({ serviceName: "", category: "", description: "", requirements: "" })
              }
            >
              + Add Another Service
            </button>
          </section>

            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="animate-spin mr-2" /> : "Submit Form"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
