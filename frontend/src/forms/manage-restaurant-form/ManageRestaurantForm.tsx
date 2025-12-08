import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Button } from "@/components/ui/button"; // Assuming Button is available
import { Separator } from "@radix-ui/react-separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButtn from "@/components/LoadingButtn";
import type { Restaurant } from "@/types";
import { useEffect } from "react";

// --- ZOD SCHEMA FIXES ---
const formSchema = z
  .object({
    // Removed config object from z.string, using .min(1) for required validation
    restaurantName: z.string().min(1, "Restaurant Name is required"),
    city: z.string().min(1, "City Name is required"),
    country: z.string().min(1, "Country Name is required"),

    // FIX: Simplified z.coerce.number. The .min(1, ...) handles the required logic.
    // The 'invalid_type_error' is generally handled by the resolver or the .min()
    // if the input is non-numeric garbage.
    deliveryPrice: z.coerce
      .number()
      .min(1, "Delivery price must be greater than 0"),

    estimatedDeliveryTime: z.coerce
      .number()
      .min(1, "Estimated delivery time must be greater than 0")
      .int("Estimated delivery time must be a whole number"),
    cuisines: z.array(z.string()).nonempty({
      message: "Please select at least one item",
    }),

    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(1, "Price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Image must be provided",
    path: ["imageFile"],
  });

type restaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isPending: boolean;
};

// --- COMPONENT FIXES ---
const ManageRestaurantForm = ({ onSave, isPending, restaurant }: Props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
      imageFile: undefined,
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );
    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: item.price / 100, // Converts cents back to standard number format
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    };
    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  // --- ONSUBMIT IMPLEMENTATION FIX ---
  const onSubmit = (formDataJson: restaurantFormData) => {
    const formData = new FormData();

    // Append simple fields
    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);

    // Convert numbers to string and use a lowest denomination (e.g., * 100 for cents)
    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDelivery",
      formDataJson.estimatedDeliveryTime.toString()
    );

    // Handle array of strings (Cuisines)
    formDataJson.cuisines.forEach((cuisine, index) => {
      // Append using bracket notation for array compatibility on the backend
      formData.append(`cuisines[${index}]`, cuisine);
    });

    // Handle array of objects (Menu Items)
    formDataJson.menuItems.forEach((item, index) => {
      formData.append(`menuItems[${index}][name]`, item.name);
      formData.append(
        `menuItems[${index}][price]`,
        (item.price * 100).toString()
      );
    });

    // Handle File upload
    if (formDataJson.imageFile) {
      formData.append("imageFile", formDataJson.imageFile);
    }

    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator className="bg-slate-300 h-px my-4" />
        <CuisinesSection />
        <Separator className="bg-slate-300 h-px my-4" />
        <MenuSection />
        <Separator className="bg-slate-300 h-px my-4" />
        <ImageSection />
        {/* Add a submit button */}
        {isPending ? (
          <LoadingButtn />
        ) : (
          <Button
            type="submit"
            className="bg-orange-500! hover:bg-slate-700! cursor-pointer"
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
