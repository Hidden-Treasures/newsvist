import api from "@/app/lib/api";
import { Biography } from "./types";

interface Data {
  email: string;
  password: string;
}

export const registerUser = async (data: Data) => {
  const response = await api.post("/register", data);
  return response.data;
};
export const loginUser = async (data: Data) => {
  const response = await api.post("/login", data);
  return response.data;
};
export const getProfile = async () => {
  const { data } = await api.get("/my-profile");
  return data;
};

export const updateUserService = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
  const { data } = await api.put(`/update/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getProfileByUsername = async (username: string) => {
  try {
    const { data } = await api.get(`/profiles/${username}`);
    return data.user;
  } catch (err) {
    return null;
  }
};

export const logoutUser = async () => {
  const response = await api.post("/logout", {}, { withCredentials: true });
  return response.data;
};
export const checkAuth = async () => {
  const response = await api.get("/check-auth");
  return response.data;
};

export const createBiography = async (formData: FormData) => {
  const response = await api.post("/bio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getBiography = async (): Promise<Biography[]> => {
  const { data } = await api.get("/bio");
  return data;
};

export const deleteBiography = async (id: string): Promise<void> => {
  await api.delete(`/bio/${id}`);
};

export const updateBiography = async (
  id: string,
  formData: FormData
): Promise<void> => {
  await api.put(`/bio/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
