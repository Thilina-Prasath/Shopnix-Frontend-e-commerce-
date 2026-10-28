import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // <--- අලුතින්
import ProductCard from "../../components/productCard";
import Loading from "../../components/loading";
import toast from "react-hot-toast";

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${searchQuery}`,
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching products");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-5 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Search Header Text */}
        <div className="mb-5 sm:mb-8 border-b pb-3 sm:pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>
          <p className="text-gray-500 mt-1.5 sm:mt-2 text-sm sm:text-base">
            {products.length} {products.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="flex justify-center py-12 sm:py-20">
            <Loading />
          </div>
        ) : (
          <>
            {query && products.length === 0 ? (
              <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-sm px-4">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  No matching products found
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  Try adjusting your search or browse our categories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
