import React, { FC, useState } from "react";
import { Loader } from "react-feather";

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
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Type name"
          value={TypeName}
          onChange={(e) => setTypeName(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={handleAddTag}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
      >
        {loading ? <Loader className="animate-spin" /> : "Add Type"}
      </button>
    </div>
  );
};

export default TypeForm;
