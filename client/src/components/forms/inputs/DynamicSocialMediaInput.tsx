"use client";

import React from "react";
import { Plus, Trash2 } from "react-feather";
import { useFieldArray, Control, useFormContext } from "react-hook-form";

interface DynamicSocialMediaInputProps {
  name: string; // e.g. "socialMedia"
  label: string;
  control: Control<any>;
}

const socialPlatforms = [
  "Instagram",
  "Twitter / X",
  "Facebook",
  "YouTube",
  "TikTok",
  "LinkedIn",
  "Snapchat",
  "Threads",
  "Other",
];

const DynamicSocialMediaInput: React.FC<DynamicSocialMediaInputProps> = ({
  name,
  label,
  control,
}) => {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <select
              {...register(`${name}.${index}.platform` as const)}
              className="w-full sm:w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Platform</option>
              {socialPlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>

            <input
              type="text"
              {...register(`${name}.${index}.handle` as const)}
              placeholder="@username"
              className="w-full sm:flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ platform: "", handle: "" })}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} /> Add Social Media
        </button>
      </div>
    </div>
  );
};

export default DynamicSocialMediaInput;
