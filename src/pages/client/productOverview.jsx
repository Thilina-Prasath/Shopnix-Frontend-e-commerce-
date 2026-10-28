import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { addToCart } from "../../utils/cart";
import axiosInstance from "../../utils/axiosInstance";
import UserReview from "./userReview";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiMinus, BiPlus } from "react-icons/bi";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

export default function ProductOverviewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setStatus("loading");

        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL +
            "/api/products/" +
            encodeURIComponent(productId),
        );

        setProduct(res.data);
        setSelectedColor(res.data.colors?.[0] || "");
        setSelectedSize(res.data.sizes?.[0] || "");
        setStatus("success");

        const reviewRes = await axiosInstance.get(
          "/api/reviews/product/" + encodeURIComponent(res.data.productId),
        );

        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error(error);
        setStatus("error");
        toast.error("Error fetching product details");
      }
    }

    fetchProduct();
  }, [productId]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

  const discount =
    product?.labelledPrice && product?.price
      ? Math.round(
          ((product.labelledPrice - product.price) / product.labelledPrice) *
            100,
        )
      : 0;

  const currentImage =
    product?.images?.[selectedImage] ||
    product?.image ||
    "https://picsum.photos/600/800";

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/wishlist",
        { productId: product.productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsInWishlist(res.data.isAdded);
      toast.success(
        res.data.isAdded ? "Added to wishlist" : "Removed from wishlist",
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);

    try {
      addToCart(product, quantity, selectedColor, selectedSize);
      toast.success("Product added to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        cart: [
          {
            ...product,
            qty: quantity,
            color: selectedColor,
            size: selectedSize,
          },
        ],
      },
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-zinc-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-[2rem] p-10 shadow-sm border border-zinc-100">
          <h2 className="text-4xl font-black mb-4">Product Not Found</h2>
          <p className="text-zinc-500 mb-8">
            This product may be removed or unavailable.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-zinc-950 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-[#9b6b43] transition"
          >
            <FiArrowLeft /> Back to products
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="relative bg-white rounded-[2.8rem] overflow-hidden shadow-sm border border-zinc-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fff6ed] via-white to-[#f5eee7]" />

              <img
                src={currentImage}
                alt={product.name}
                className="relative z-10 w-full h-[540px] object-contain p-8 sm:p-12"
              />

              {discount > 0 && (
                <span className="absolute top-6 left-6 z-20 bg-zinc-950 text-white px-5 py-2 rounded-full text-sm font-bold shadow">
                  {discount}% OFF
                </span>
              )}

              <button
                onClick={handleWishlistToggle}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition"
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-zinc-700 text-xl" />
                )}
              </button>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white shrink-0 transition ${
                      selectedImage === index
                        ? "border-[#9b6b43] shadow-md"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-[2.8rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-zinc-100"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, index) => (
                    <FiStar key={index} className="fill-current" />
                  ))}
                </div>
                <span className="text-sm text-zinc-500">
                  {averageRating} / 5 ({reviews.length} reviews)
                </span>
              </div>

              {product.stock > 0 && (
                <span className="hidden sm:flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <FiCheckCircle /> In Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              {product.name}
            </h1>

            <p className="text-zinc-500 mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-end gap-4 mt-8">
              <h2 className="text-4xl font-black text-zinc-950">
                Rs. {formatPrice(product.price)}
              </h2>

              {discount > 0 && (
                <p className="text-xl text-zinc-400 line-through mb-1">
                  Rs. {formatPrice(product.labelledPrice)}
                </p>
              )}
            </div>

            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <p className="font-bold mb-3">Select Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-2xl border font-bold transition ${
                        selectedSize === size
                          ? "bg-zinc-950 text-white border-zinc-950"
                          : "border-zinc-200 hover:border-[#9b6b43] text-zinc-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="mt-8">
                <p className="font-bold mb-3">Select Color</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-3 rounded-2xl border font-semibold transition ${
                        selectedColor === color
                          ? "bg-[#9b6b43] text-white border-[#9b6b43]"
                          : "border-zinc-200 hover:border-[#9b6b43] text-zinc-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <p className="font-bold mb-3">Quantity</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-100 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition"
                  >
                    <BiMinus />
                  </button>

                  <span className="w-12 text-center font-black">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition"
                  >
                    <BiPlus />
                  </button>
                </div>

                <p className="text-sm text-zinc-500">
                  {product.stock > 0
                    ? `${product.stock} items available`
                    : "Stock unavailable"}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-zinc-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition disabled:opacity-60"
              >
                <FiShoppingBag />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-[#9b6b43] text-white py-4 rounded-2xl font-bold hover:bg-[#835936] transition"
              >
                Buy Now
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-10">
              {[
                [FiTruck, "Fast Delivery"],
                [FiRefreshCcw, "Easy Returns"],
                [FiShield, "Secure Payment"],
              ].map(([Icon, title]) => (
                <div key={title} className="bg-[#FAF7F2] rounded-2xl p-4">
                  <Icon className="text-2xl mb-2 text-[#9b6b43]" />
                  <p className="font-bold text-sm">{title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <section className="mt-16 bg-white rounded-[2.8rem] p-6 sm:p-8 lg:p-10 border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="uppercase tracking-widest text-sm text-[#9b6b43] font-bold">
                Reviews
              </p>
              <h2 className="text-3xl font-black mt-2">Customer Reviews</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-[#FAF7F2] rounded-3xl p-6 border border-zinc-100"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-black">{review.name}</h3>
                        <p className="text-xs text-zinc-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-amber-500">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>

                    <p className="text-zinc-600 mt-4">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="bg-[#FAF7F2] rounded-3xl p-10 text-center border border-zinc-100">
                  <p className="text-zinc-500">
                    No reviews yet. Be the first to review this product.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-zinc-100">
              <UserReview productId={product.productId} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
