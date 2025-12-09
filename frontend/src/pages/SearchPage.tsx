import { useSearchRestaurants } from "@/api/RestaurantApi";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
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
  if (isPending) {
    return <span>Loading....</span>;
  }
  if (!results?.data || !city) {
    return <span>No Results Found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">Insert Cuisines Here</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
