import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/types";
import { addType, deleteType, getTypes } from "@/services/news";

export const useAddType = () => {
  return useMutation({
    mutationFn: ({ name }: { name: string }) => addType(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
    },
  });
};

export const useTypes = () => {
  return useQuery({
    queryKey: ["types"],
    queryFn: getTypes,
    staleTime: 1000 * 60 * 5,
  });
};

export const deleteTypes = () => {
  return useMutation({
    mutationFn: (TypeId: string) => deleteType(TypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
    },
  });
};
