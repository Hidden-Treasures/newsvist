import api from "@/app/lib/api";

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
  const response = await api.get("/my-profile", { withCredentials: true });
  return response.data;
};
export const logoutUser = async () => {
  const response = await api.post("/logout", {}, { withCredentials: true });
  return response.data;
};
export const checkAuth = async () => {
  const response = await api.get("/check-auth", { withCredentials: true });
  return response.data;
};
