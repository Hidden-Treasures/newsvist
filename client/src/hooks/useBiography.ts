import {
  getArticlesByBiographyService,
  getBiographiesService,
} from "@/services/biography";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useArticlesByBiography = (person: string, page: number) => {
  return useQuery({
    queryKey: ["biography-articles", person, page],
    queryFn: () => getArticlesByBiographyService({ person, page }),
    enabled: !!person,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBiographies = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["biographies", page, limit],
    queryFn: () => getBiographiesService({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};
