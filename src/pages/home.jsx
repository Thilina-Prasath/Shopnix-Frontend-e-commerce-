import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import ProductPage from "./client/productPage";
import ProductOverviewPage from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkOut";
import SearchProductPage from "./client/searchProducts";
import UserReview from "./client/userReview";
import WishlistPage from "./client/WishlistPage";
import AnnouncementBanner from "../components/AnnouncementBanner";
import Footer from "../components/footer";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiHeart,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiShoppingBag,
  FiCheck,
} from "react-icons/fi";
import Chatbot from "../components/Chatbot";

const categories = [
  { title: "Men", image: "/men.png", category: "Men" },
  { title: "Women", image: "/girl02.png", category: "Women" },
  { title: "Footwear", image: "/shoes.png", category: "Footwear" },
  { title: "Accessories", image: "/ACCESSORIES.jpg", category: "Accessories" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

function FashionHomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
      .then((res) => {
        setProducts(res.data.slice(0, 8));
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/reviews/featured")

      .then((res) => {
        const reviewData = Array.isArray(res.data)
          ? res.data
          : res.data?.reviews || [];

        setReviews(
          reviewData
            .filter((review) => review.comment?.trim())
            .slice(0, 3)
            .map((review) => ({
              id: review._id || review.id,
              name: review.name?.trim() || "Customer",
              role: "Customer",
              rating: Math.min(5, Math.max(1, Number(review.rating) || 1)),
              text: review.comment.trim(),
              avatar:
                review.image || review.profilePicture
                  ? review.image || review.profilePicture
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      review.name?.trim() || "Customer",
                    )}&background=e8b98a&color=fff&rounded=true&bold=true`,
            })),
        );
      })
      .catch(() => {
        setReviews([]);
      });
  }, []);

  const formatPrice = (price) => {
    const value = Number(price);
    return Number.isFinite(value) ? `$${value.toFixed(2)}` : "$0.00";
  };

  return (
    <main className="w-full overflow-hidden bg-[#FAF7F2] text-zinc-900">
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[auto] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-12 sm:pb-20 overflow-hidden">
        {/* Multi-layer animated ambient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 15% 20%, #f3d9c4 0%, transparent 40%),
              radial-gradient(circle at 85% 80%, #fe8c9a8 0%, transparent 45%),
              linear-gradient(145deg, #fffaf5 0%, #f6f1eb 50%, #ffffff 100%)
            `,
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating glow orbs */}
        <motion.div
          className="absolute -top-24 -left-24 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-[#e8b98a]/25 blur-[100px] pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-[#c98b5f]/20 blur-[110px] pointer-events-none"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-[#f0d9c0]/30 blur-[80px] pointer-events-none"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-center">
          {/* ========== LEFT CONTENT ========== */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.15 },
              },
            }}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/85 backdrop-blur-md border border-white/70 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] mb-5 sm:mb-7"
            >
              <motion.span
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              >
                <FiShoppingBag className="text-[#9b6b43]" />
              </motion.span>
              <span>New Collection</span>
              <motion.span
                className="ml-1 h-1.5 w-1.5 rounded-full bg-[#c18a5a]"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden">
              <motion.h1
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.08] tracking-tight text-zinc-900"
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  Style That Feels
                </motion.span>

                <motion.span
                  className="block mt-1 relative w-fit mx-auto lg:mx-0"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="bg-gradient-to-r from-[#9b6b43] via-[#b8875a] to-[#c9a07a] bg-clip-text text-transparent">
                    Simple & Premium
                  </span>

                  <motion.span
                    className="absolute left-0 -bottom-1 sm:-bottom-1.5 h-[3px] sm:h-[5px] bg-gradient-to-r from-[#e8b98a] to-[#c98b5f] rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "70%", opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
                  />
                </motion.span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-4 sm:mt-6 text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Discover clean, stylish, and comfortable fashion pieces designed
              for your everyday lifestyle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-6 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center gap-2.5 bg-zinc-950 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base overflow-hidden shadow-lg shadow-zinc-950/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>

              <Link
                to="/wishlist"
                className="group inline-flex items-center justify-center gap-2.5 bg-white/90 backdrop-blur border border-zinc-200/80 text-zinc-800 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-zinc-300"
              >
                Wishlist
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FiHeart className="text-[#c18a5a]" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0">
              {[
                ["10K+", "Customers"],
                ["100+", "Brands"],
                ["4.9", "Rating"],
              ].map(([num, label], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.75 + i * 0.12,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 16px 30px -10px rgba(0,0,0,0.1)",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.07)] border border-white/80 cursor-default"
                >
                  <p className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
                    {num}
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-zinc-500 mt-0.5">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ========== RIGHT IMAGE CARD ========== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative group max-w-md mx-auto lg:max-w-none"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              className="absolute -z-10 inset-4 bg-[#e8b98a]/35 blur-[60px] rounded-[3.5rem]"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.4, 0.65, 0.4],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative rounded-[1.5rem] sm:rounded-[2.8rem] overflow-hidden bg-white p-1.5 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)]"
              whileHover={{
                rotateX: 4,
                rotateY: -6,
                scale: 1.02,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative rounded-[1.2rem] sm:rounded-[2.2rem] overflow-hidden"
              >
                <motion.img
                  src="/image copy 2.png"
                  alt="Fashion"
                  className="w-full h-[320px] sm:h-[500px] md:h-[540px] object-cover object-top"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.04 }}
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"
                  initial={{ x: "-140%", skewX: "-15deg" }}
                  animate={{ x: "140%" }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Discount Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  delay: 0.9,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute top-4 left-4 sm:top-7 sm:left-7 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.15)] border border-white/60"
              >
                <p className="text-[11px] sm:text-[13px] text-zinc-500 font-medium leading-none">
                  Up to
                </p>
                <p className="text-xl sm:text-[1.75rem] font-black text-zinc-900 leading-tight tracking-tight">
                  50% OFF
                </p>
              </motion.div>

              {/* Rating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  opacity: { delay: 1.2, duration: 0.5 },
                  scale: { delay: 1.2, type: "spring", stiffness: 260 },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.6,
                  },
                }}
                className="absolute bottom-4 right-4 sm:bottom-7 sm:right-7 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-2.5 border border-white/60"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <FiStar className="text-[#e8b98a] fill-[#e8b98a] text-base sm:text-lg" />
                </motion.div>
                <div>
                  <p className="text-xs sm:text-sm font-black leading-none">
                    4.9
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium">
                    2K+ Reviews
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-4 sm:-mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            [FiTruck, "Fast Delivery", "Quick and safe shipping"],
            [FiRefreshCcw, "Easy Returns", "Simple return process"],
            [FiShield, "Secure Payment", "Protected checkout"],
          ].map(([Icon, title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-zinc-100 flex items-center gap-3 sm:gap-4"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f4eadf] flex items-center justify-center shrink-0">
                <Icon className="text-xl sm:text-2xl text-[#8b5e3c]" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base">{title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-[#9b6b43] font-bold">
              Categories
            </p>
            <h2 className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 font-bold hover:text-[#9b6b43] transition"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/products?category=${cat.category}`)}
              className="group cursor-pointer relative rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-[180px] sm:h-[280px] md:h-[320px] object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 text-center">
                <h3 className="text-white text-base sm:text-2xl font-black tracking-wide">
                  {cat.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-[#9b6b43] font-bold">
                Popular Products
              </p>
              <h2 className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 font-bold hover:text-[#9b6b43] transition"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product, index) => {
              const productId =
                product.productId || product._id || product.id || index;

              return (
                <motion.div
                  key={productId}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    navigate(`/overview/${encodeURIComponent(productId)}`)
                  }
                  className="group cursor-pointer"
                >
                  <div className="relative bg-zinc-100 rounded-xl sm:rounded-[2rem] overflow-hidden aspect-[4/5]">
                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "https://picsum.photos/id/237/500/650"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiHeart size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="mt-2 sm:mt-4">
                    <h3 className="font-bold text-sm sm:text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5 sm:mt-2 gap-1">
                      <div className="flex text-amber-500 text-xs sm:text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="fill-current" />
                        ))}
                      </div>
                      <p className="font-black text-sm sm:text-base">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────── */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Soft background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[300px] bg-[#e8b98a]/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm uppercase tracking-widest text-[#9b6b43] font-bold mb-2 sm:mb-3"
            >
              Real Stories
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight"
            >
              Loved by thousands
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 sm:mt-4 text-zinc-500 max-w-xl mx-auto text-sm sm:text-base"
            >
              Don’t just take our word for it — see what our customers are
              saying.
            </motion.p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {reviews.length === 0 ? (
              <div className="md:col-span-3 text-center text-zinc-500 py-8 sm:py-12 text-sm sm:text-base">
                Customer reviews will appear here soon.
              </div>
            ) : (
              reviews.map((item, i) => (
                <motion.div
                  key={item.id || `${item.name}-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-zinc-100/80 flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-3 sm:mb-5">
                    {[...Array(item.rating)].map((_, idx) => (
                      <FiStar
                        key={idx}
                        className="text-[#e8b98a] fill-[#e8b98a] text-base sm:text-lg"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-zinc-600 leading-relaxed flex-1 mb-5 sm:mb-8 text-sm sm:text-base">
                    “{item.text}”
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-zinc-100">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#f4eadf]"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 text-sm sm:text-base">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-500">
                        {item.role}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f4eadf] flex items-center justify-center">
                        <FiCheck className="text-[#9b6b43] text-xs sm:text-sm" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 text-center"
          ></motion.div>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />
      <Sidebar />
      <AnnouncementBanner />
      <Chatbot />

      <Routes>
        <Route path="/" element={<FashionHomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route
          path="/about"
          element={
            <div className="py-20 sm:py-32 text-center text-2xl sm:text-4xl">
              About Page
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="py-20 sm:py-32 text-center text-2xl sm:text-4xl">
              Contact Us
            </div>
          }
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchProductPage />} />
        <Route path="/overview/:productId" element={<ProductOverviewPage />} />
        <Route path="/reviews" element={<UserReview />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route
          path="*"
          element={
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-center py-20 sm:py-32 text-zinc-500">
              404 — Page Not Found
            </h1>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
