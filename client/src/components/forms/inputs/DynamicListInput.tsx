"use client";

import React from "react";
import { Plus, Trash2 } from "react-feather";
import { useFieldArray, Control } from "react-hook-form";

interface DynamicListInputProps {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({
  name,
  label,
  placeholder,
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="text"
              {...control.register?.(`${name}.${index}` as const)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onClick={() => append("")}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} /> Add {label}
        </button>
      </div>
    </div>
  );
};

export default DynamicListInput;
