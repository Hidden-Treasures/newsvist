import React, { FC, useState } from "react";
import { Loader, X } from "react-feather";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface TypeFormProps {
  Types: string[];
  onSubmit: (data: { TypeName: string }) => void;
  loading: boolean;
}

const TypeForm: FC<TypeFormProps> = ({ Types, onSubmit, loading }) => {
  const [TypeName, setTypeName] = useState<string>("");

  const handleAddTag = () => {
    if (!TypeName.trim()) return;
    onSubmit({ TypeName });
    setTypeName("");
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type Name
        </label>
        <div className="relative">
          <Input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 pr-10 pl-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Type name"
            value={TypeName}
            onChange={(e) => setTypeName(e.target.value)}
          />
          {TypeName && (
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center justify-center w-5 h-5 my-auto rounded-full bg-gray-600 text-white hover:bg-gray-500"
              onClick={() => setTypeName("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <Button
        type="button"
        onClick={handleAddTag}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
      >
        {loading ? <Loader className="animate-spin" /> : "Add Type"}
      </Button>
    </div>
  );
};

export default TypeForm;
