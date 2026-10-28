import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import {
  FiArrowLeft,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state?.cart || []);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.qty || 1),
    0,
  );

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const changeQty = (index, amount) => {
    const newCart = [...cart];
    const newQty = Number(newCart[index].qty || 1) + amount;

    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }

    newCart[index].qty = newQty;
    setCart(newCart);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number should be 10 digits";
    }

    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCartData = () => {
    return cart.every(
      (item) =>
        item.productId && item.qty > 0 && typeof item.productId === "string",
    );
  };

  const placeOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!validateCartData()) {
      toast.error("Invalid cart items. Please refresh and try again.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to place order");
      return;
    }

    setIsPlacingOrder(true);

    const orderInformation = {
      products: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        color: item.color || "",
        size: item.size || "",
      })),
      name: fullName,
      email,
      phone: phoneNumber,
      address: `${address}, ${city}, ${postalCode}`,
    };

    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        orderInformation,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        },
      );

      const { order, payhereConfig } = res.data;

      window.payhere.onCompleted = function () {
        toast.success("Payment completed successfully");
        setCart([]);
        navigate("/products");
      };

      window.payhere.onDismissed = function () {
        toast.error("Payment window closed");
        setIsPlacingOrder(false);
      };

      window.payhere.onError = function (error) {
        console.log("PayHere Error:", error);
        toast.error("Payment failed");
        setIsPlacingOrder(false);
      };

      const payment = {
        sandbox: true,
        merchant_id: payhereConfig.merchantId,
        return_url: "http://localhost:5173/products",
        cancel_url: "http://localhost:5173/checkout",
        notify_url:
          "https://deserved-dipsacaceous-shawana.ngrok-free.dev/api/orders/notify",
        order_id: order.orderId,
        items: `Order ID: ${order.orderId}`,
        amount: payhereConfig.amount,
        currency: payhereConfig.currency,
        hash: payhereConfig.hash,
        first_name: fullName,
        last_name: "",
        email,
        phone: phoneNumber,
        address,
        city,
        country: "Sri Lanka",
      };

      window.payhere.startPayment(payment);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Please login again");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const InputField = ({
    label,
    value,
    setValue,
    error,
    type = "text",
    placeholder,
  }) => (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl sm:rounded-2xl border px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#FAF7F2] outline-none transition focus:bg-white text-sm sm:text-base ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-zinc-200 focus:border-[#9b6b43]"
        }`}
      />

      {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
    </div>
  );

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-12 text-center shadow-sm border border-zinc-100 max-w-md w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FiShoppingBag className="text-3xl sm:text-4xl text-[#9b6b43]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3">
            Your cart is empty
          </h2>

          <p className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Add some products before continuing to checkout.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-zinc-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <section className="bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)] border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-500 hover:text-[#9b6b43] mb-5 sm:mb-8 transition"
          >
            <FiArrowLeft /> Back to Cart
          </Link>

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
            <FiCreditCard />
            Secure Checkout
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
            Checkout
          </h1>

          <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
            Complete your delivery details and confirm your order securely.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[1fr_390px] gap-5 sm:gap-8 items-start">
          <div className="space-y-5 sm:space-y-8">
            <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                  <FiUser className="text-lg sm:text-xl text-[#9b6b43]" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black">
                    Customer Details
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    Enter your contact information.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                <InputField
                  label="Full Name"
                  value={fullName}
                  setValue={setFullName}
                  error={errors.fullName}
                  placeholder="Enter full name"
                />

                <InputField
                  label="Email Address"
                  value={email}
                  setValue={setEmail}
                  error={errors.email}
                  type="email"
                  placeholder="example@email.com"
                />

                <InputField
                  label="Phone Number"
                  value={phoneNumber}
                  setValue={setPhoneNumber}
                  error={errors.phoneNumber}
                  type="tel"
                  placeholder="0771234567"
                />

                <InputField
                  label="City"
                  value={city}
                  setValue={setCity}
                  error={errors.city}
                  placeholder="Enter city"
                />

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                    Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    placeholder="Enter your full address"
                    className={`w-full rounded-xl sm:rounded-2xl border px-3.5 sm:px-4 py-3 sm:py-3.5 bg-[#FAF7F2] outline-none resize-none transition focus:bg-white text-sm sm:text-base ${
                      errors.address
                        ? "border-red-300 focus:border-red-500"
                        : "border-zinc-200 focus:border-[#9b6b43]"
                    }`}
                  />

                  {errors.address && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <InputField
                  label="Postal Code"
                  value={postalCode}
                  setValue={setPostalCode}
                  error={errors.postalCode}
                  placeholder="Enter postal code"
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-7">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                  <FiShoppingBag className="text-lg sm:text-xl text-[#9b6b43]" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black">
                    Order Items
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    {totalItems} item{totalItems > 1 ? "s" : ""} in your order.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] border border-zinc-100 p-3 sm:p-4 hover:bg-white hover:shadow-sm transition"
                  >
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                      className="w-full sm:w-24 h-36 sm:h-24 rounded-xl sm:rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black truncate text-sm sm:text-base">
                        {item.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color && `Color: ${item.color}`}
                      </p>

                      <p className="font-bold mt-1.5 sm:mt-2 text-sm sm:text-base">
                        Rs. {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="flex items-center bg-white rounded-xl sm:rounded-2xl border border-zinc-100 p-1">
                        <button
                          onClick={() => changeQty(index, -1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition"
                        >
                          <BiMinus />
                        </button>

                        <span className="w-8 sm:w-10 text-center font-black text-sm sm:text-base">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => changeQty(index, 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition"
                        >
                          <BiPlus />
                        </button>
                      </div>

                      <p className="font-black min-w-[90px] sm:min-w-[100px] text-right text-sm sm:text-base">
                        Rs. {formatPrice(Number(item.price) * Number(item.qty))}
                      </p>

                      <button
                        onClick={() => removeFromCart(index)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition shrink-0"
                      >
                        <BiTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-zinc-900">
                    Rs. {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>

                <div className="flex justify-between text-zinc-500">
                  <span>Tax</span>
                  <span className="font-semibold text-zinc-900">Rs. 0.00</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 mt-4 sm:mt-6 pt-4 sm:pt-6 flex items-center justify-between">
                <span className="text-base sm:text-lg font-black">Total</span>
                <span className="text-2xl sm:text-3xl font-black">
                  Rs. {formatPrice(subtotal)}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className="w-full mt-5 sm:mt-7 bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-zinc-800 transition disabled:bg-zinc-400"
              >
                <FiLock />
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </button>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-zinc-100">
                {[
                  [FiLock, "Secure"],
                  [FiTruck, "Free Delivery"],
                  [FiMapPin, "Sri Lanka"],
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
                  Your payment is processed securely through PayHere.
                </p>
              </div>

              <Link
                to="/cart"
                className="w-full mt-4 sm:mt-5 bg-[#FAF7F2] text-zinc-700 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
              >
                <FiArrowLeft />
                Back to Cart
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
