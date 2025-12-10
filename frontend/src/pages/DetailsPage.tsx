import { useGetRestaurant } from "@/api/RestaurantApi";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import type { CartItem, MenuItem as MenuItemType } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import OrderSummary from "@/components/OrderSummary";
import MenuItem from "@/components/MenuItem";

const DetailsPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isPending } = useGetRestaurant(restaurantId);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const addtoCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      // Check if item already exists in cart
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id == menuItem._id
      );
      let updatedCartItems;
      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }
      return updatedCartItems;
    });
  };

  if (isPending || !restaurant) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col gap-1-">
      <AspectRatio ratio={16 / 5}>
        <img src={restaurant.imageUrl} alt="" />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              addToCart={() => addtoCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary restaurant={restaurant} cartItems={cartItems} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
