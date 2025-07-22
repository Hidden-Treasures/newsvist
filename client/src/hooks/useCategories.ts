import {
  addCategories,
  deleteCategory,
  deleteSubCat,
  getCategories,
  getCategoriesWithSub,
  getSubCat,
  updateCategory,
  updateSubCat,
} from "@/services/news";
import { queryClient } from "@/services/types";
import { useMutation, useQuery } from "@tanstack/react-query";

// Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

// Subcategories Hook
export const useSubCategories = (selectedNewsCategory: string) => {
  return useQuery({
    queryKey: ["subCategories", selectedNewsCategory],
    queryFn: () => getSubCat(selectedNewsCategory),
    enabled: !!selectedNewsCategory,
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesWithSub,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddCategoryMutation = () => {
  return useMutation({
    mutationFn: ({ name }: { name: string }) => addCategories(name, [], ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useAddSubCategoryMutation = () => {
  return useMutation({
    mutationFn: ({
      subcategoryName,
      parentCategory,
    }: {
      subcategoryName: string;
      parentCategory: string;
    }) => addCategories("", [subcategoryName], parentCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const addCategoryMutation = () => {
  return useMutation({
    mutationFn: ({
      name,
      subcategories,
      parentCategory,
    }: {
      name: string;
      subcategories: string[];
      parentCategory: string;
    }) => addCategories(name, subcategories, parentCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const updateCategoryMutation = () => {
  return useMutation({
    mutationFn: ({
      categoryId,
      categoryName,
    }: {
      categoryId: string;
      categoryName: string;
    }) => updateCategory(categoryId, categoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const updateSubCategoryMutation = () => {
  return useMutation({
    mutationFn: async ({
      categoryId,
      subcategoryId,
      subcategoryName,
    }: {
      categoryId: string;
      subcategoryId: string;
      subcategoryName: string;
    }) => {
      const response = await updateSubCat(
        categoryId,
        subcategoryId,
        subcategoryName
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const deleteCategoryMutation = () => {
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const deleteSubCategoryMutation = () => {
  return useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
    }: {
      categoryId: string;
      subcategoryId: string;
    }) => deleteSubCat(categoryId, subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
