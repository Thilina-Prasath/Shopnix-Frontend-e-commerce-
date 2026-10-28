import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPackage, FiBox, FiTag } from "react-icons/fi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Product deleted successfully");
      setProducts((prev) =>
        prev.filter((product) => product.productId !== productId),
      );
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      [product.name, product.category, product.subCategory, product.productId]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const lowStockCount = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5,
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock || 0) <= 0,
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiPackage />
              Product Catalog
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Products
            </h1>

            <p className="text-sm sm:text-base text-zinc-500 mt-2">
              Manage product details, prices, images, stock and categories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-96">
              <FiSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 py-3 sm:py-4 outline-none focus:border-[#9b6b43] shadow-sm transition text-sm sm:text-base"
              />
            </div>

            <Link
              to="/admin/add-product"
              className="bg-zinc-950 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition text-sm sm:text-base whitespace-nowrap"
            >
              <FaPlus />
              Add Product
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SummaryCard title="Total Products" value={products.length} />
          <SummaryCard title="Low Stock" value={lowStockCount} />
          <SummaryCard title="Out of Stock" value={outOfStockCount} />
        </div>

        <section className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-zinc-100">
            <h2 className="text-xl sm:text-2xl font-black">Product List</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Showing {filteredProducts.length} items in catalog.
            </p>
          </div>

          <div className="p-3 sm:p-5 md:p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex justify-center py-20 sm:py-32">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 sm:py-24 px-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <FiBox className="text-2xl sm:text-3xl text-[#9b6b43]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black">
                    No products found
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-500 mt-2">
                    Try searching with another product name or ID.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.productId}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="bg-[#FAF7F2] border border-zinc-100 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden hover:bg-white hover:shadow-md transition group"
                    >
                      <div className="relative h-48 sm:h-56 md:h-64 bg-white overflow-hidden">
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black text-[#9b6b43]">
                          {product.category || "Product"}
                        </div>

                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-zinc-950 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-mono">
                          {product.productId}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="min-w-0">
                            <h3 className="font-black text-base sm:text-xl line-clamp-2">
                              {product.name}
                            </h3>

                            <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 mt-1.5 sm:mt-2">
                              <FiTag className="flex-shrink-0" />
                              <span className="truncate">
                                {product.subCategory ||
                                  product.category ||
                                  "No category"}
                              </span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-lg sm:text-2xl font-black">
                              Rs. {Number(product.price || 0).toLocaleString()}
                            </p>
                            {product.labelledPrice && (
                              <p className="text-[10px] sm:text-xs line-through text-zinc-400">
                                Rs.{" "}
                                {Number(
                                  product.labelledPrice || 0,
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-zinc-100">
                            <p className="text-[10px] sm:text-xs text-zinc-500">
                              Stock
                            </p>
                            <p className="font-black text-sm sm:text-base">
                              {product.stock || 0}
                            </p>
                          </div>

                          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-zinc-100">
                            <p className="text-[10px] sm:text-xs text-zinc-500">
                              Status
                            </p>
                            <p
                              className={`font-black text-sm sm:text-base ${
                                Number(product.stock || 0) > 0
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {Number(product.stock || 0) > 0
                                ? "Available"
                                : "Out"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                          <button
                            onClick={() => deleteProduct(product.productId)}
                            className="flex-1 py-3 sm:py-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl sm:rounded-2xl font-bold transition flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
                          >
                            <FaTrash className="text-xs sm:text-sm" />
                            Delete
                          </button>

                          <button
                            onClick={() =>
                              navigate("/admin/edit-product", {
                                state: product,
                              })
                            }
                            className="flex-1 py-3 sm:py-4 bg-zinc-950 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-[#9b6b43] transition flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
                          >
                            <FaEdit className="text-xs sm:text-sm" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 border border-zinc-100 shadow-sm">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-3 sm:mb-4">
        <FiPackage className="text-lg sm:text-xl text-[#9b6b43]" />
      </div>

      <p className="text-xs sm:text-sm text-zinc-500">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black mt-1">{value}</h3>
    </div>
  );
}
