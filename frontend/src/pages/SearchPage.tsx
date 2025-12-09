import { useSearchRestaurants } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  const { results, isPending, isError } = useSearchRestaurants(city);
  const resultsObject = useSearchRestaurants(city);

  // 2. Log the entire object to the browser console
  console.log(
    "Results from useSearchRestaurants:",
    resultsObject,
    isPending,
    isError
  );
  return (
    <span>
      User searched for {city}{" "}
      <span>
        {results?.data.map((restaurant) => (
          <span>
            found - Ahsan {restaurant.restaurantName}, {restaurant.city}
          </span>
        ))}
      </span>
    </span>
  );
};

export default SearchPage;
