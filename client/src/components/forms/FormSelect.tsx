"use client";

import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { Select } from "../ui/select";
import { Label } from "../ui/label";

interface FormSelectProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  options: string[];
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  register,
  error,
  options,
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        {...register(name, { required })}
        className={`w-full rounded-xl border p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default FormSelect;
