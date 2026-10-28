import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiX,
  FiSearch,
  FiMessageSquare,
  FiImage,
} from "react-icons/fi";

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("product");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login as admin");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const productReviews = reviews.filter(
    (review) => review.productId && review.productId.trim() !== "",
  );

  const siteReviews = reviews.filter(
    (review) => !review.productId || review.productId.trim() === "",
  );

  const displayedReviews =
    activeTab === "product" ? productReviews : siteReviews;

  const filteredReviews = useMemo(() => {
    return displayedReviews.filter((review) =>
      [review.name, review.email, review.comment]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [displayedReviews, searchQuery]);

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const openImageModal = (url) => {
    setSelectedImageUrl(url);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiMessageSquare />
              Review Management
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Reviews
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Manage product reviews and website feedback from customers.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <FiSearch
              className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 outline-none focus:border-[#9b6b43] shadow-sm transition text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-8">
          <SummaryCard title="Total Reviews" value={reviews.length} />
          <SummaryCard title="Product Reviews" value={productReviews.length} />
          <SummaryCard title="Average Rating" value={averageRating} />
        </div>

        <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 md:p-6 border-b border-zinc-100">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
              <TabButton
                label="Product Reviews"
                count={productReviews.length}
                active={activeTab === "product"}
                onClick={() => setActiveTab("product")}
              />

              <TabButton
                label="Website Reviews"
                count={siteReviews.length}
                active={activeTab === "site"}
                onClick={() => setActiveTab("site")}
              />
            </div>
          </div>

          <div className="p-3 sm:p-5 md:p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex justify-center py-20 sm:py-32">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
                </div>
              ) : filteredReviews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-14 sm:py-24 px-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <FiMessageSquare className="text-2xl sm:text-3xl text-[#9b6b43]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black">
                    No reviews found
                  </h3>
                  <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                    Customer reviews will appear here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                >
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review._id}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="bg-[#FAF7F2] border border-zinc-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 hover:bg-white hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl border border-zinc-100 flex items-center justify-center text-lg sm:text-xl font-black text-[#9b6b43] shrink-0">
                            {review.name?.[0]?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-black truncate text-sm sm:text-base">
                              {review.name}
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate">
                              {review.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex text-amber-500 shrink-0 text-sm sm:text-base">
                          {[...Array(5)].map((_, index) => (
                            <FiStar
                              key={index}
                              className={
                                index < Number(review.rating || 0)
                                  ? "fill-current"
                                  : ""
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-4 sm:mt-6 text-zinc-600 leading-relaxed text-sm sm:text-base">
                        “{review.comment}”
                      </p>

                      {review.images?.length > 0 && (
                        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide">
                          {review.images.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => openImageModal(img)}
                              className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-100 shrink-0 group"
                            >
                              <img
                                src={img}
                                alt="Review"
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition">
                                <FiImage className="text-white opacity-0 group-hover:opacity-100 transition" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] sm:text-xs text-zinc-500 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-zinc-200">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "No date"}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImageUrl}
                alt="Review"
                className="w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-2xl sm:rounded-[2rem] shadow-2xl bg-white"
              />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white text-zinc-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl hover:bg-[#FAF7F2] transition"
              >
                <FiX />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-zinc-100 shadow-sm">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-3 sm:mb-4">
        <FiStar className="text-lg sm:text-xl text-[#9b6b43]" />
      </div>

      <p className="text-xs sm:text-sm text-zinc-500">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black mt-1">{value}</h3>
    </div>
  );
}

function TabButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
        active
          ? "bg-zinc-950 text-white"
          : "bg-[#FAF7F2] text-zinc-500 hover:text-[#9b6b43]"
      }`}
    >
      {label}
      <span
        className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
          active ? "bg-white/20 text-white" : "bg-white text-zinc-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
