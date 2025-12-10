import type { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const getMyRestaurant = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Unable to get restaurant details");
    }
    return response.json();
  };

  const {
    data: restaurant,
    isPending,
    error,
  } = useQuery({
    queryKey: ["fetchMyRestaurant"], // Key must be an array
    queryFn: getMyRestaurant,
  });
  if (error) {
    toast.error(error.toString());
  }
  return { restaurant, isPending };
};

export const useUpdateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to update Restaurant");
    }
    return response.json();
  };

  const {
    mutateAsync: updateRestaurant,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: updateRestaurantRequest,
  });

  if (isSuccess) {
    toast.success("Reastaurant Updated");
  }
  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isPending };
};

export const useGetMyRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get Orders");
    }
    return response.json();
  };

  const { data: orders, isPending } = useQuery({
    queryKey: ["fetchMyRestaurantOrders"],
    queryFn: getMyRestaurantOrdersRequest,
  });

  return { orders, isPending };
};

type UpdateOrderStatusRequest = {
  orderId: string;
  status: string;
};

export const useUpdateMyRestaurantOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyRestaurantOrder = async (
    updateStatusOrderRequest: UpdateOrderStatusRequest
  ) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/my/restaurant/orderrrrrr/${updateStatusOrderRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateStatusOrderRequest.status }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update status");
    }
    return response.json();
  };

  const {
    mutateAsync: updateRestaurantStatus,
    isPending,
    isError,
    reset,
    isSuccess,
  } = useMutation({
    mutationFn: updateMyRestaurantOrder,
  });

  if (isSuccess) {
    toast.success("Status Updated");
  }
  if (isError) {
    toast.error("Unable to update order status");
    reset();
  }

  return { updateRestaurantStatus, isPending };
};
