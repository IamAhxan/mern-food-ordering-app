import type { Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to Create Restaurant");
    }

    return response.json();
  };

  const {
    mutateAsync: createRestaurant,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createMyRestaurantRequest,
  });

  if (isSuccess) {
    toast.success("Reastaurant Created");
  }
  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { createRestaurant, isPending };
};
