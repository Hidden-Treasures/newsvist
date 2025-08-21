"use client";

import React, { FC, useMemo, useRef, useState } from "react";
import { Edit3, Filter, Plus, Search, Trash2 } from "react-feather";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CategoryForm from "@/components/forms/CategoryForm";
import {
  deleteCategoryMutation,
  deleteSubCategoryMutation,
  updateCategoryMutation,
  updateSubCategoryMutation,
  useAddCategoryMutation,
  useAddSubCategoryMutation,
  useAllCategories,
} from "@/hooks/useCategories";
import {
  AddCategoryData,
  Category,
  SubCategory,
  UpdateCategoryData,
  UpdateSubCategoryData,
} from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ManageCategories: FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubCategory, setCurrentSubCategory] =
    useState<SubCategory | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "withSubs" | "noSubs">("all");

  const formRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading, refetch } = useAllCategories();

  const addCategory = useAddCategoryMutation();
  const addSubCategory = useAddSubCategoryMutation();
  const updateCatMutation = updateCategoryMutation();
  const updateSubCatMutation = updateSubCategoryMutation();
  const deleteCatMutation = deleteCategoryMutation();
  const deleteSubCatMutation = deleteSubCategoryMutation();

  // ------------------- Handlers -------------------
  const handleAddCategory = async ({
    categoryName,
    subcategoryName,
    selectedParentCategory,
  }: AddCategoryData) => {
    if (subcategoryName && !selectedParentCategory) {
      toast.error("Please select a parent category");
      return;
    }
    if (!subcategoryName && selectedParentCategory) {
      toast.error("Please enter a subcategory name");
      return;
    }

    if (categoryName && !subcategoryName) {
      addCategory.mutate(
        { name: categoryName },
        {
          onSuccess: () => {
            toast.success("Category added successfully!");
            refetch();
          },
          onError: (error: any) => {
            toast.error(`Error adding category: ${error.message}`);
          },
        }
      );
    }
    if (subcategoryName && selectedParentCategory) {
      addSubCategory.mutate(
        {
          subcategoryName,
          parentCategory: selectedParentCategory,
        },
        {
          onSuccess: () => {
            toast.success("Subcategory added successfully!");
            refetch();
          },
          onError: (error: any) => {
            toast.error(`Error adding subcategory: ${error.message}`);
          },
        }
      );
    }
  };

  const handleUpdateCategory = ({
    categoryId,
    categoryName,
  }: UpdateCategoryData) => {
    updateCatMutation.mutate(
      { categoryId, categoryName },
      {
        onSuccess: () => {
          toast.success("Category updated successfully!");
          refetch();
          setEditMode(false);
          setCurrentCategory(null);
        },
        onError: (error: any) => {
          toast.error(`Error updating category: ${error.message}`);
        },
      }
    );
  };

  const handleUpdateSubCategory = ({
    categoryId,
    subcategoryId,
    subcategoryName,
  }: UpdateSubCategoryData) => {
    updateSubCatMutation.mutate(
      { categoryId, subcategoryId, subcategoryName },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(data.message || "Subcategory updated successfully!");
            refetch();
            setEditMode(false);
            setCurrentSubCategory(null);
          } else {
            toast.error(data.message || "Failed to update subcategory");
          }
        },
        onError: (error: any) => {
          toast.error(`Error updating subcategory: ${error.message}`);
        },
      }
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCatMutation.mutate(categoryId, {
      onSuccess: () => toast.success("Category deleted successfully!"),
      onError: (error: any) =>
        toast.error(`Error deleting category: ${error.message}`),
    });
  };

  const handleDeleteSubcategory = (
    categoryId: string,
    subcategoryId: string
  ) => {
    deleteSubCatMutation.mutate(
      { categoryId, subcategoryId },
      {
        onSuccess: () => toast.success("Subcategory deleted successfully!"),
        onError: (error: any) =>
          toast.error(`Error deleting subcategory: ${error.message}`),
      }
    );
  };

  const handleEditCategory = (category: Category) => {
    setEditMode(true);
    setCurrentCategory(category);
  };

  const handleEditSubCategory = (
    category: Category,
    subcategory: SubCategory
  ) => {
    setEditMode(true);
    setCurrentCategory(category);
    setCurrentSubCategory(subcategory);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch =
        cat.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.items?.some((sub) =>
          sub.name.toLowerCase().includes(search.toLowerCase())
        );

      const matchFilter =
        filter === "all"
          ? true
          : filter === "withSubs"
          ? cat.items && cat.items.length > 0
          : !cat.items || cat.items.length === 0;

      return matchSearch && matchFilter;
    });
  }, [categories, search, filter]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setEditMode(false);
    setCurrentCategory(null);
    setCurrentSubCategory(null);
  };

  return (
    <main className="space-y-6 md:mt-20 md:mx-20">
      <div ref={formRef}>
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold text-slate-200">
              {editMode ? "Edit Category" : "Add Category / Subcategory"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              categories={categories}
              onSubmit={handleAddCategory}
              loading={addCategory.isPending}
              busy={addSubCategory.isPending}
              editMode={editMode}
              currentCategory={currentCategory ?? undefined}
              currentSubCategory={currentSubCategory ?? undefined}
              onUpdateCategory={handleUpdateCategory}
              onUpdateSubCategory={handleUpdateSubCategory}
            />
          </CardContent>
        </Card>
      </div>

      {/* Category List */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-slate-200">
            Category List
          </CardTitle>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-800/60 border-slate-700"
              />
            </div>
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 text-slate-300">
                  <Filter size={16} /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("withSubs")}>
                  With Subcategories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("noSubs")}>
                  No Subcategories
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-slate-400">No categories match your search.</p>
          ) : (
            filteredCategories?.map((category, i) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-800 p-4 bg-slate-800/40"
              >
                {/* Parent Category */}
                <div className="mb-4">
                  <div className="flex justify-between items-center p-2 rounded-md">
                    <Badge
                      variant="secondary"
                      className="rounded-full font-bold text-lg"
                    >
                      {category.title}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        className="text-blue-500 mr-2"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        className="text-red-500"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  {/* Subcategories */}
                  <div className="mt-3 space-y-2 space-x-10">
                    {category.items?.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        className="flex items-center text-gray-500 justify-between rounded-lg bg-slate-900/40 px-2 py-1"
                      >
                        <span>{subcategory.name}</span>
                        <div>
                          <Button
                            className="text-blue-500 ml-2"
                            onClick={() =>
                              handleEditSubCategory(category, subcategory)
                            }
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            className="text-red-500 ml-2 bg-none"
                            onClick={() =>
                              handleDeleteSubcategory(
                                category._id,
                                subcategory._id
                              )
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!category.items || category.items.length === 0) && (
                      <p className="text-xs text-slate-500 italic">
                        No subcategories
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      <Button
        onClick={scrollToForm}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center"
      >
        <Plus size={22} />
      </Button>

      {/* <ul className="mt-4">
        <h1 className="text-2xl font-semibold my-4">Category List</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => (
            <li key={category._id} className="mb-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-lg font-semibold text-black">
                  {category.title}
                </span>
                <div>
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <ul className="ml-4">
                {category.items?.map((subcategory) => (
                  <li
                    key={subcategory._id}
                    className="flex items-center text-gray-600"
                  >
                    <span>{subcategory.name}</span>
                    <div>
                      <button
                        className="text-blue-500 ml-2"
                        onClick={() =>
                          handleEditSubCategory(category, subcategory)
                        }
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="text-red-500 ml-2 bg-none"
                        onClick={() =>
                          handleDeleteSubcategory(category._id, subcategory._id)
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul> */}
    </main>
  );
};

export default ManageCategories;
