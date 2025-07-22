"use client";

import React, { FC, useState } from "react";
import { Edit3, Trash2 } from "react-feather";

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

const ManageCategories: FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubCategory, setCurrentSubCategory] =
    useState<SubCategory | null>(null);

  const { data: categories = [], isLoading, refetch } = useAllCategories();

  const addCategory = useAddCategoryMutation();
  const addSubCategory = useAddSubCategoryMutation();
  const updateCatMutation = updateCategoryMutation();
  const updateSubCatMutation = updateSubCategoryMutation();
  const deleteCatMutation = deleteCategoryMutation();
  const deleteSubCatMutation = deleteSubCategoryMutation();

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

  // const fetchCategories = async () => {
  //   try {
  //     const response = await getCategoriesWithSub();
  //     setCategories(response);
  //   } catch (error: any) {
  //     console.error("Error fetching categories:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const handleDeleteCategory = async (categoryId: string) => {
  //   try {
  //     const res = await deleteCategory(categoryId);
  //     toast.success(res);
  //     fetchCategories();
  //   } catch (error: any) {
  //     toast.error(`Error deleting category: ${error.message}`);
  //     console.error("Error deleting category:", error.message);
  //   }
  // };

  // const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
  //   try {
  //     const res = await deleteSubCat(categoryId, subcategoryId);
  //     toast.success(res);
  //     fetchCategories();
  //   } catch (error: any) {
  //     toast.error(`Error deleting subcategory: ${error.message}`);
  //     console.error("Error deleting subcategory:", error.message);
  //   }
  // };

  // const handleUpdateCategory = async ({ categoryId, categoryName }: UpdateCategoryData) => {
  //   try {
  //     await updateCategory(categoryId, categoryName);
  //     toast.success("Category updated successfully!");
  //     fetchCategories();
  //     setEditMode(false);
  //     setCurrentCategory(null);
  //   } catch (error: any) {
  //     toast.error(`Error updating category: ${error.message}`);
  //   }
  // };

  // const handleUpdateSubCategory = async ({
  //   categoryId,
  //   subcategoryId,
  //   subcategoryName,
  // }: UpdateSubCategoryData) => {
  //   try {
  //     await updateSubCat(categoryId, subcategoryId, subcategoryName);
  //     toast.success("Subcategory updated successfully!");
  //     fetchCategories();
  //     setEditMode(false);
  //     setCurrentSubCategory(null);
  //   } catch (error: any) {
  //     toast.error(`Error updating subcategory: ${error.message}`);
  //   }
  // };

  return (
    <div className="md:mt-24 md:mx-20 bg-white md:px-4 rounded-md drop-shadow-md h-screen overflow-y-scroll hide-scrollbar">
      <h1 className="text-2xl font-semibold md:my-4">Manage Categories</h1>
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
      <ul className="mt-4">
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
      </ul>
    </div>
  );
};

export default ManageCategories;
