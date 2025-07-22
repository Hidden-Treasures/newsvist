"use client";

import React, { FC } from "react";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { TypeItem } from "@/services/types";
import TypeForm from "@/components/forms/TypeForm";
import { deleteTypes, useAddType, useTypes } from "@/hooks/useTypes";

const ManageTypes: FC = () => {
  const addType = useAddType();
  const { data: types, isLoading, refetch } = useTypes();
  const deleteType = deleteTypes();

  const handleDeleteType = (typeId: string) => {
    deleteType.mutate(typeId, {
      onSuccess: () => {
        toast.success("Type deleted successfully!");
        refetch();
      },
      onError: (error: any) =>
        toast.error(`Error deleting type: ${error.message}`),
    });
  };

  const handleAddType = async ({ TypeName }: { TypeName: string }) => {
    addType.mutate(
      { name: TypeName },
      {
        onSuccess: () => {
          toast.success("Type added successfully!");
          refetch();
        },
        onError: (error: any) => {
          toast.error(`Error adding type: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="md:mt-24 md:mx-20 bg-white md:px-4 rounded-md drop-shadow-md h-screen overflow-x-auto">
      <h1 className="text-2xl font-semibold my-4">Manage Type</h1>
      <TypeForm Types={types} onSubmit={handleAddType} loading={isLoading} />
      <ul className="mt-4">
        <h1 className="text-2xl font-semibold my-4">Type List</h1>
        {types?.length === 0 ? (
          <p>No Type found.</p>
        ) : (
          types?.map((type: TypeItem, index: number) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-lg font-semibold text-black">
                  {type.name}
                </span>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteType(type._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageTypes;
