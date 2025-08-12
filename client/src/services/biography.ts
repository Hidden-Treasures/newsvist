import api from "@/app/lib/api";
import { handleError } from "./news";

export const getBioByNameService = async (bioName: string) => {
  try {
    const safeName = encodeURIComponent(bioName);
    const { data } = await api.get(`/biography/${safeName}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getArticlesByBiographyService = async ({
  person,
  page = 1,
  limit = 5,
}: {
  person: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const { data } = await api.get(`/biography-articles`, {
      params: { person, page, limit },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getBiographiesService = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  try {
    const { data } = await api.get("/biographies", {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};
