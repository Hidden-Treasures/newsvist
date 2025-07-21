"use client";

import {
  checkAuth,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/auth";
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
export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
