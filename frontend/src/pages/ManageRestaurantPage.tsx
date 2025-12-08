import { useCreateMyRestaurant } from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

export default function ManageRestaurantPage() {
  const { createRestaurant, isPending } = useCreateMyRestaurant();
  return (
    <ManageRestaurantForm onSave={createRestaurant} isPending={isPending} />
  );
}
