import { useState } from "react";
import { addToCart, getCart, getTotal, removeFromCart } from "../../utils/cart";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiCheckCircle,
} from "react-icons/fi";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  const handleQuantityChange = (item, amount) => {
    addToCart(item, amount);
    setCart(getCart());
  };

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  const savings = cart.reduce((total, item) => {
    if (Number(item.labelledPrice) > Number(item.price)) {
      return (
        total +
        (Number(item.labelledPrice) - Number(item.price)) *
          Number(item.qty || 1)
      );
    }
    return total;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
        <Header />
        <Sidebar />

        <div className="min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-6 sm:p-8 md:p-12 text-center max-w-md w-full">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FiShoppingBag className="text-3xl sm:text-5xl text-[#9b6b43]" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3">
              Your cart is empty
            </h1>

            <p className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">
              Looks like you have not added any products yet.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-zinc-800 transition"
            >
              Start Shopping
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <Header />
      <Sidebar />

      <section className="bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)] border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
            <FiShoppingBag />
            Shopping Bag
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
            Your Cart
          </h1>

          <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
            Review your selected products before checkout.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[1fr_390px] gap-5 sm:gap-8 items-start">
          <section className="space-y-3 sm:space-y-5">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black">Cart Items</h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {totalItems} item{totalItems > 1 ? "s" : ""} selected
                </p>
              </div>

              <Link
                to="/products"
                className="hidden sm:inline-flex text-sm font-bold text-zinc-500 hover:text-[#9b6b43] transition"
              >
                Continue Shopping
              </Link>
            </div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                      className="w-full sm:w-28 h-44 sm:h-28 rounded-xl sm:rounded-2xl object-cover bg-[#FAF7F2]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-black">
                            {item.name}
                          </h3>

                          <p className="text-[10px] sm:text-xs text-zinc-400 mt-1">
                            ID: {item.productId}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition shrink-0"
                        >
                          <BiTrash />
                        </button>
                      </div>

                      {(item.size || item.color) && (
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                          {item.size && (
                            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF7F2] text-[10px] sm:text-xs font-semibold text-zinc-600">
                              Size: {item.size}
                            </span>
                          )}

                          {item.color && (
                            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF7F2] text-[10px] sm:text-xs font-semibold text-zinc-600">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-5">
                        <div>
                          <p className="text-lg sm:text-xl font-black">
                            Rs. {formatPrice(item.price)}
                          </p>

                          {Number(item.labelledPrice) > Number(item.price) && (
                            <p className="text-xs sm:text-sm text-zinc-400 line-through">
                              Rs. {formatPrice(item.labelledPrice)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="flex items-center bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-zinc-100 p-1">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={Number(item.qty) <= 1}
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-white disabled:opacity-40 transition"
                            >
                              <BiMinus />
                            </button>

                            <span className="w-10 sm:w-12 text-center font-black text-sm sm:text-base">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-white transition"
                            >
                              <BiPlus />
                            </button>
                          </div>

                          <p className="text-right font-black text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">
                            Rs.{" "}
                            {formatPrice(
                              Number(item.price || 0) * Number(item.qty || 1),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-zinc-900">
                    Rs. {formatPrice(getTotal())}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>You saved</span>
                    <span className="font-semibold">
                      Rs. {formatPrice(savings)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 mt-4 sm:mt-6 pt-4 sm:pt-6 flex items-center justify-between">
                <span className="text-base sm:text-lg font-black">Total</span>
                <span className="text-2xl sm:text-3xl font-black">
                  Rs. {formatPrice(getTotal())}
                </span>
              </div>

              <Link
                to="/checkout"
                state={{ cart }}
                className="mt-5 sm:mt-7 w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
              >
                Proceed to Checkout
                <FiArrowRight />
              </Link>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-zinc-100">
                {[
                  [FiTruck, "Free Delivery"],
                  [FiShield, "Secure"],
                  [FiRefreshCcw, "Easy Returns"],
                ].map(([Icon, label]) => (
                  <div key={label} className="text-center">
                    <Icon
                      className="mx-auto mb-1.5 sm:mb-2 text-[#9b6b43]"
                      size={16}
                    />
                    <p className="text-[10px] sm:text-xs text-zinc-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-[#FAF7F2] p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
                <FiCheckCircle
                  className="text-[#9b6b43] mt-0.5 sm:mt-1 shrink-0"
                  size={16}
                />
                <p className="text-xs sm:text-sm text-zinc-500">
                  Your items are saved in your cart until checkout.
                </p>
              </div>

              <Link
                to="/products"
                className="mt-4 sm:mt-5 w-full bg-[#FAF7F2] text-zinc-700 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center hover:bg-zinc-200 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
