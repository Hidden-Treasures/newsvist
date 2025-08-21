"use client";
import React, { FC, useEffect, useState } from "react";
import { Loader, X } from "react-feather";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select } from "../ui/select";

interface Category {
  _id: string;
  title: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface CategoryFormProps {
  categories: Category[];
  onSubmit: (data: {
    categoryName: string;
    subcategoryName: string;
    selectedParentCategory: string;
  }) => void;
  onUpdateCategory: (data: {
    categoryId: string;
    categoryName: string;
  }) => void;
  onUpdateSubCategory: (data: {
    categoryId: string;
    subcategoryId: string;
    subcategoryName: string;
  }) => void;
  loading: boolean;
  busy: boolean;
  editMode: boolean;
  currentCategory?: Category;
  currentSubCategory?: SubCategory;
}

const CategoryForm: FC<CategoryFormProps> = ({
  categories,
  onSubmit,
  onUpdateCategory,
  onUpdateSubCategory,
  loading,
  busy,
  editMode,
  currentCategory,
  currentSubCategory,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");

  useEffect(() => {
    if (editMode && currentCategory) {
      setCategoryName(currentCategory.title);
    }
    if (editMode && currentSubCategory) {
      setSubcategoryName(currentSubCategory.name);
    }
  }, [editMode, currentCategory, currentSubCategory]);

  const handleAddCategory = () => {
    if (editMode && currentCategory && !currentSubCategory) {
      onUpdateCategory({
        categoryId: currentCategory._id,
        categoryName,
      });
    } else if (editMode && currentCategory && currentSubCategory) {
      onUpdateSubCategory({
        categoryId: currentCategory._id,
        subcategoryId: currentSubCategory._id,
        subcategoryName,
      });
    } else {
      onSubmit({
        categoryName,
        subcategoryName,
        selectedParentCategory,
      });
    }

    setCategoryName("");
    setSubcategoryName("");
    setSelectedParentCategory("");
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2">
          Category Name
        </label>
        <div className="relative">
          <Input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 pr-10 pl-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {categoryName && (
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center justify-center w-5 h-5 my-auto rounded-full bg-gray-600 text-white hover:bg-gray-500"
              onClick={() => setCategoryName("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddCategory}
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : editMode && currentCategory ? (
          "Update Category"
        ) : (
          "Add Category"
        )}
      </Button>

      <div className="my-8">
        <Label className="block text-gray-400 text-sm font-bold mb-2">
          Parent Category
        </Label>
        <Select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedParentCategory}
          onChange={(e) => setSelectedParentCategory(e.target.value)}
        >
          <option value="">Select Parent Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <Label className="block text-gray-400 text-sm font-bold mb-2">
          Subcategory Name
        </Label>
        <div className="relative">
          <Input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 pr-10 pl-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter subcategory name"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
          />
          {subcategoryName && (
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center justify-center w-5 h-5 my-auto rounded-full bg-gray-600 text-white hover:bg-gray-500"
              onClick={() => setSubcategoryName("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddCategory}
      >
        {busy ? (
          <Loader className="animate-spin" />
        ) : editMode && currentSubCategory ? (
          "Update SubCategory"
        ) : (
          "Add Subcategory"
        )}
      </Button>
    </div>
  );
};

export default CategoryForm;
