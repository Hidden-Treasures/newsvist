"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { useLogout, useProfile } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  username: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isPending, isError } = useProfile();
  const { mutate: logoutMutate } = useLogout();
  const router = useRouter();

  const logout = async () => {
    await logoutMutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user && !isError,
        logout,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
