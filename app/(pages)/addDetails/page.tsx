"use client";

import { useForm, useFieldArray } from "react-hook-form";

export default function ServiceForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      services: [{ serviceName: "", category: "", description: "", requirements: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          🏛️ Government Services
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Institution Details */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Institution Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <select {...register("province")} className="border p-2 rounded">
                <option>Select Province</option>
                <option>Western</option>
                <option>Northern</option>
                <option>Select Province</option>
                <option>Select Province</option>
                <option>Select Province</option>
              </select>
              <select {...register("district")} className="border p-2 rounded">
                <option>Select District</option>
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

          {/* Upload Image */}
          <section>
            <h2 className="text-lg font-semibold">Upload Image</h2>
            <input type="file" {...register("profileImage")} className="border p-2 rounded w-full" />
          </section>

          {/* Service Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Service Information</h2>

            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md space-y-3 relative bg-gray-100">
                <input {...register(`services.${index}.serviceName`)} placeholder="Service Name" className="border p-2 rounded w-full" />
                <input {...register(`services.${index}.category`)} placeholder="Category" className="border p-2 rounded w-full" />
                <textarea {...register(`services.${index}.description`)} placeholder="Description" className="border p-2 rounded w-full" rows="3"></textarea>
                <textarea {...register(`services.${index}.requirements`)} placeholder="Requirements" className="border p-2 rounded w-full" rows="3"></textarea>
                
                {index > 0 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => remove(index)}
                  >
                    ✖ Remove
                  </button>
                )}
              </div>
            ))}

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
}
