"use client";

import React, { FC, useMemo, useRef, useState } from "react";
import { Plus, Search, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { TypeItem } from "@/services/types";
import TypeForm from "@/components/forms/TypeForm";
import { deleteTypes, useAddType, useTypes } from "@/hooks/useTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ManageTypes: FC = () => {
  const [search, setSearch] = useState("");
  const addType = useAddType();
  const { data: types, isLoading, refetch } = useTypes();
  const deleteType = deleteTypes();

  const formRef = useRef<HTMLDivElement>(null);

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

  const filteredTypes = useMemo(() => {
    if (!types) return [];

    return types.filter((typ: any) => {
      const name = typ.name || typ.title || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, types]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="space-y-6 md:mt-20 md:mx-20">
      <div ref={formRef}>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold text-slate-200">
              Manage Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypeForm
              Types={types}
              onSubmit={handleAddType}
              loading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Type List */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-slate-200">
            Type List
          </CardTitle>
        </CardHeader>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800/60 border-slate-700"
            />
          </div>
        </div>
      </Card>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : types?.length === 0 ? (
          <p>No Type match your search.</p>
        ) : (
          filteredTypes?.map((type: TypeItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-slate-800 p-4 bg-slate-800/40"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                  <Badge className="text-lg font-semibold text-black">
                    {type.name}
                  </Badge>
                  <Button
                    className="text-red-500"
                    onClick={() => handleDeleteType(type._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
      <Button
        onClick={scrollToForm}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center"
      >
        <Plus size={22} />
      </Button>
    </main>
  );
};

export default ManageTypes;
