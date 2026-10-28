import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/productCard";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiSliders,
  FiX,
  FiRefreshCcw,
  FiPackage,
} from "react-icons/fi";

const MAX_PRICE = 100000;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  "Black",
  "White",
  "Navy",
  "Beige",
  "Brown",
  "Green",
  "Red",
  "Blue",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function FilterPanel({
  priceRange,
  setPriceRange,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  inStockOnly,
  setInStockOnly,
  clearFilters,
}) {
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h3 className="font-black text-lg sm:text-xl">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs sm:text-sm text-[#9b6b43] font-bold"
        >
          Clear
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div>
          <p className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
            Price Range
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="rounded-xl sm:rounded-2xl border border-zinc-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#9b6b43]"
              placeholder="Min"
            />

            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="rounded-xl sm:rounded-2xl border border-zinc-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#9b6b43]"
              placeholder="Max"
            />
          </div>

          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            step="500"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-[#9b6b43]"
          />
        </div>

        <div>
          <p className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Size</p>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`rounded-lg sm:rounded-xl border py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition ${
                  selectedSizes.includes(size)
                    ? "bg-zinc-950 text-white border-zinc-950"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-[#9b6b43]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Color</p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border transition ${
                  selectedColors.includes(color)
                    ? "bg-zinc-950 text-white border-zinc-950"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-[#9b6b43]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className="w-full flex items-center justify-between rounded-xl sm:rounded-2xl border border-zinc-200 px-4 sm:px-5 py-3.5 sm:py-4 hover:border-[#9b6b43] transition"
        >
          <span className="font-semibold text-sm sm:text-base">
            In stock only
          </span>

          <span
            className={`w-11 h-5.5 sm:w-12 sm:h-6 rounded-full p-1 transition ${
              inStockOnly ? "bg-zinc-950" : "bg-zinc-200"
            }`}
          >
            <span
              className={`block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white transition ${
                inStockOnly ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError("");

        const url = categoryParam
          ? `${import.meta.env.VITE_BACKEND_URL}/api/products/category/${categoryParam}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/products`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categoryParam]);

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      list = list.filter((product) =>
        [product.name, product.description, ...(product.altNames || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    list = list.filter((product) => {
      const price = Number(product.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedSizes.length > 0) {
      list = list.filter((product) =>
        selectedSizes.some((size) => product.sizes?.includes(size)),
      );
    }

    if (selectedColors.length > 0) {
      list = list.filter((product) =>
        selectedColors.some((color) => product.colors?.includes(color)),
      );
    }

    if (inStockOnly) {
      list = list.filter(
        (product) => product.isAvailable !== false && Number(product.stock) > 0,
      );
    }

    if (sortBy === "price-low")
      list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high")
      list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    return list;
  }, [
    products,
    searchQuery,
    priceRange,
    selectedSizes,
    selectedColors,
    inStockOnly,
    sortBy,
  ]);

  const categoryTitle = categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : "All Products";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <section className="relative px-4 sm:px-6 lg:px-12 py-10 sm:py-16 md:py-20 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiPackage />
              Shop Collection
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mt-3 sm:mt-5 tracking-tight">
              {categoryTitle}
            </h1>

            <p className="text-zinc-600 mt-3 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base">
              Discover modern, stylish, and comfortable products selected for
              your everyday lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-5">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden rounded-xl sm:rounded-2xl border border-zinc-200 p-3 sm:p-4 bg-white shrink-0"
              >
                <FiSliders size={18} />
              </button>

              <div className="relative flex-1 min-w-0">
                <FiSearch
                  className="absolute left-3.5 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl sm:rounded-2xl bg-zinc-50 border border-zinc-200 py-3 sm:py-4 pl-10 sm:pl-12 pr-3 sm:pr-5 text-sm outline-none focus:bg-white focus:border-[#9b6b43] transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 lg:flex-none rounded-xl sm:rounded-2xl border border-zinc-200 bg-white px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-[#9b6b43]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="hidden sm:flex bg-zinc-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-[#9b6b43]"
                      : "text-zinc-400"
                  }`}
                >
                  <FiGrid />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-[#9b6b43]"
                      : "text-zinc-400"
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-5 sm:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          <main>
            <div className="flex items-center justify-between mb-4 sm:mb-7">
              <p className="text-xs sm:text-sm text-zinc-500">
                Showing{" "}
                <span className="font-black text-zinc-950">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <button
                onClick={clearFilters}
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#9b6b43]"
              >
                <FiRefreshCcw /> Reset
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-center text-sm sm:text-base">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-white rounded-xl sm:rounded-[2rem] p-2 sm:p-3"
                  >
                    <div className="aspect-[4/5] rounded-xl sm:rounded-[1.6rem] bg-zinc-200" />
                    <div className="h-3 sm:h-4 bg-zinc-200 rounded mt-3 sm:mt-4 w-3/4" />
                    <div className="h-3 sm:h-4 bg-zinc-200 rounded mt-2 sm:mt-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 py-14 sm:py-24 text-center shadow-sm px-4">
                <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
                  No products found
                </h2>
                <p className="text-zinc-500 mb-5 sm:mb-7 text-sm sm:text-base">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-zinc-950 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-zinc-800 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6"
                    : "space-y-4 sm:space-y-6"
                }
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.productId || product._id || index}
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl sm:rounded-[2rem] p-2 sm:p-3 border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </section>

      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#FAF7F2] z-50 p-4 sm:p-5 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-black">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2.5 sm:p-3 rounded-full bg-white shadow-sm"
                >
                  <FiX />
                </button>
              </div>

              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                clearFilters={clearFilters}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
