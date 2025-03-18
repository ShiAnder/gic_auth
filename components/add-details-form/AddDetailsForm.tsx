"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react"; // Import useState for managing districts
import { db } from "@/lib/db"; // Import Prisma Client

export const AddDetailsForm = ({ label, user }) => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      services: [{ serviceName: "", category: "", description: "", requirements: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const [districts, setDistricts] = useState([]); // State to store districts

  // Watch the province field for changes
  const selectedProvince = watch("province");

  // Define districts for each province
  const provinceDistricts = {
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

  // Update districts when province changes
  useState(() => {
    if (selectedProvince && provinceDistricts[selectedProvince]) {
      setDistricts(provinceDistricts[selectedProvince]);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  const onSubmit = async (data) => {
    try {
      // Save institution details
      const institution = await db.organization.create({
        data: {
          name: data.institution,
          address: data.district, // Assuming district is used as address
          contactNumber: data.contact,
          email: data.email,
          website: data.website,
          district: data.district,
          category: "Default Category", // You can add a category field to the form if needed
          userId: user.id, // Link to the user who created the organization
        },
      });

      // Save services
      for (const service of data.services) {
        await db.service.create({
          data: {
            name: service.serviceName,
            category: service.category,
            description: service.description,
            organizationId: institution.id, // Link to the organization
          },
        });
      }

      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center my-6">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          {label} {/* Dynamic label passed from ClientPage */}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Institution Details */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Institution Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <select
                {...register("province")}
                className="border p-2 rounded"
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setDistricts(provinceDistricts[selectedProvince] || []);
                }}
              >
                <option value="">Select Province</option>
                {Object.keys(provinceDistricts).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <select {...register("district")} className="border p-2 rounded">
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input {...register("institution")} placeholder="Institution Name" className="border p-2 rounded" />
              <input {...register("website")} placeholder="Website URL" className="border p-2 rounded" />
            </div>
          </section>

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
                  rows="3"
                ></textarea>
                <textarea
                  {...register(`services.${index}.requirements`)}
                  placeholder="Requirements"
                  className="border p-2 rounded w-full"
                  rows="3"
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

          {/* Submit Button */}
          <button type="submit" className="bg-green-500 text-white p-3 rounded w-full mt-4">
            Submit Form
          </button>
        </form>

        <footer className="text-center text-sm text-gray-500 mt-6">
          © 2025 Government Services. All rights reserved.
        </footer>
      </div>
    </div>
  );
};