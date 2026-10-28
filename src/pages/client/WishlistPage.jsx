import axios from "axios";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import ProductCard from "../../components/productCard";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { FiHeart, FiGrid, FiList, FiSearch, FiX } from "react-icons/fi";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -6,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const float = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const headerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.85]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.98]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your wishlist.");
          return;
        }
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist`;
        if (categoryParam)
          url += `?category=${encodeURIComponent(categoryParam)}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load your wishlist. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [categoryParam]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        [p.name, p.description, ...(p.altNames || [])].some((text) =>
          text?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case "price-high":
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [products, searchQuery, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage,
  );
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  useEffect(() => setCurrentPage(1), [searchQuery, sortBy, categoryParam]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-zinc-900 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-6 sm:p-10"
        >
          <motion.div
            animate={float.animate}
            className="text-4xl sm:text-6xl mb-5 sm:mb-6 mx-auto w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center bg-[#FAF7F2] rounded-2xl sm:rounded-3xl text-[#9b6b43]"
          >
            ♡
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
            Access Denied
          </h2>
          <p className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">
            {error}
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              className="inline-block bg-zinc-950 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-[#9b6b43] transition-all"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 overflow-x-hidden">
      <Header />
      <Sidebar />

      {/* Hero */}
      <motion.section
        ref={headerRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden border-b border-zinc-100 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute top-10 right-8 sm:top-16 sm:right-20 w-40 h-40 sm:w-72 sm:h-72 bg-[#e8b98a]/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -25, 25, 0], y: [0, 20, -15, 0] }}
            transition={{ duration: 22, repeat: Infinity }}
            className="absolute bottom-8 left-6 sm:bottom-16 sm:left-16 w-40 h-40 sm:w-72 sm:h-72 bg-[#c99a6b]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]"
            >
              <FiHeart className="text-[#9b6b43]" />
              Curated Collection
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mt-4 sm:mt-6"
            >
              My Wishlist
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-lg text-zinc-500 max-w-lg mx-auto mt-3 sm:mt-4"
            >
              The pieces that captured your heart. Ready when you are.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm text-zinc-500"
            >
              <span className="font-semibold text-zinc-700">
                {products.length} items saved
              </span>
              <span className="w-px h-4 sm:h-5 bg-zinc-300" />
              <span>Last updated {new Date().toLocaleDateString()}</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Sticky controls */}
      <div className="sticky top-16 sm:top-20 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row gap-3 sm:gap-4 md:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <FiSearch
              className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-zinc-200 focus:border-[#9b6b43] focus:bg-white rounded-xl sm:rounded-2xl pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 sm:py-3.5 text-sm outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#9b6b43] transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none bg-white border border-zinc-200 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm outline-none focus:border-[#9b6b43] transition-all"
            >
              <option value="newest">Recently Saved</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">A to Z</option>
            </select>

            <div className="hidden sm:flex bg-[#FAF7F2] rounded-2xl p-1 border border-zinc-200">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-400 hover:text-[#9b6b43]"
                }`}
              >
                <FiGrid size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-400 hover:text-[#9b6b43]"
                }`}
              >
                <FiList size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 sm:pb-24 pt-5 sm:pt-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 sm:py-28"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin mb-5 sm:mb-6" />
              <p className="text-zinc-500 tracking-wide text-xs sm:text-sm font-semibold">
                Loading your saved pieces...
              </p>
            </motion.div>
          ) : currentProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center py-14 sm:py-24 px-4"
            >
              <motion.div
                variants={fadeInScale}
                animate={float.animate}
                className="mx-auto w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center mb-5 sm:mb-7"
              >
                <FiHeart className="text-3xl sm:text-5xl text-[#9b6b43]/50" />
              </motion.div>
              <motion.h3
                variants={fadeInUp}
                className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3 tracking-tight"
              >
                Wishlist is Empty
              </motion.h3>
              <motion.p
                variants={fadeInUp}
                className="text-zinc-500 max-w-sm mx-auto mb-6 sm:mb-8 text-sm sm:text-base"
              >
                The things you love will appear here. Start saving beautiful
                pieces.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link
                  to="/products"
                  className="inline-block bg-zinc-950 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-[#9b6b43] transition-all"
                >
                  Discover Treasures
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
                  : "space-y-4 sm:space-y-6"
              }
            >
              {currentProducts.map((product, idx) => (
                <motion.div
                  key={product.productId || idx}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-white rounded-xl sm:rounded-[1.5rem] border border-zinc-100 shadow-sm overflow-hidden"
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center mt-8 sm:mt-14 gap-2 sm:gap-3 flex-wrap"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl font-bold text-sm transition-all ${
                  currentPage === page
                    ? "bg-zinc-950 text-white shadow-md"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-[#9b6b43] hover:text-[#9b6b43]"
                }`}
              >
                {page}
              </motion.button>
            ))}
          </motion.div>
        )}

        {!isLoading && currentProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-zinc-500 text-xs sm:text-sm mt-8 sm:mt-12 border-t border-zinc-200 pt-5 sm:pt-7"
          >
            Showing {startIndex + 1}–
            {Math.min(
              startIndex + productsPerPage,
              filteredAndSortedProducts.length,
            )}{" "}
            of {filteredAndSortedProducts.length} items
          </motion.div>
        )}
      </div>
    </div>
  );
}
