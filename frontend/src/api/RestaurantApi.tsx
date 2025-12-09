import type { SearchState } from "@/pages/SearchPage";
import type { RestaurantSearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    const response = await fetch(
      `${API_BASE_URL}/api/restaurants/search/${city}?${params.toString()}`
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
    queryKey: ["searchRestaurants", searchState],
    queryFn: createSearchRequest,
    enabled: !!city,
  });

  return {
    results,
    isPending,
    isError,
  };
};
