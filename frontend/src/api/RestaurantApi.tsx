import type { RestaurantSearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (city?: string) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurants/search/${city}`,
      { cache: "no-cache" }
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }
    return response.json();
  };

  const {
    data: results,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["searchRestaurants"],
    queryFn: createSearchRequest,
    enabled: !!city,
  });

  return {
    results,
    isPending,
    isError,
  };
};
