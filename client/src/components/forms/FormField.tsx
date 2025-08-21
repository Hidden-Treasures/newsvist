"use client";

import React, { FC } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        {...register(name, { required })}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl border p-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-gray-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default FormField;
