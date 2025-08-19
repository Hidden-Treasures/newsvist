"use client";

import {
  checkAuth,
  createBiography,
  deleteBiography,
  getBiography,
  getProfile,
  getProfileByUsername,
  loginUser,
  logoutUser,
  registerUser,
  updateBiography,
} from "@/services/auth";
import { Biography, queryClient } from "@/services/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useProfileByUsername = (username?: string) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfileByUsername(username!),
    enabled: !!username,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBiography = () => {
  return useMutation({
    mutationFn: createBiography,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },
  });
};

export const useBiography = () => {
  return useQuery<Biography[]>({
    queryKey: ["biography"],
    queryFn: getBiography,
  });
};
export const useDeleteBiography = () => {
  return useMutation({
    mutationFn: deleteBiography,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },
  });
};
export const useUpdateBiography = () => {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateBiography(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography"] });
    },
  });
};
