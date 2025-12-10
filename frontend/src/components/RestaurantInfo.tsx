import type { Restaurant } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
  return (
    <Card className="border-sla">
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {restaurant.restaurantName}
        </CardTitle>
        <CardDescription className="flex">
          {restaurant.cuisines.map((item, index) => (
            <span className="flex">
              <span>{item}</span>
              {index < restaurant.cuisines.length - 1 && <Dot />}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default RestaurantInfo;
