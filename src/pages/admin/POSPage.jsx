import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BsSearch, BsCartX, BsPrinter, BsTrash } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import CheckoutPopup from "../../components/CheckoutPopup";
import {
  FiShoppingBag,
  FiPackage,
  FiCreditCard,
  FiBarChart,
} from "react-icons/fi";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/products",
        );

        const availableProducts = response.data.filter(
          (p) => p.isAvailable && Number(p.stock) > 0,
        );

        setProducts(availableProducts);
      } catch (error) {
        toast.error("Failed to load products for POS");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.productId === product.productId,
    );

    if (existingItem) {
      if (existingItem.quantity < Number(product.stock)) {
        setCart(
          cart.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        toast.error("Maximum stock limit reached");
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsCheckoutOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const processPayment = async (paymentDetails) => {
    toast.success(`${paymentDetails.method.toUpperCase()} Payment successful`);
    setIsCheckoutOpen(false);
    setCart([]);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 overflow-x-hidden lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-3 sm:gap-4 h-full">
        {/* Products Section */}
        <section className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden min-h-[50vh] lg:min-h-0">
          <div className="p-4 sm:p-5 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#FAF7F2] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-[#9b6b43]">
                  <FiCreditCard />
                  POS System
                </div>

                <h1 className="text-2xl sm:text-3xl font-black mt-2 sm:mt-3">
                  Quick Sale
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Search products, scan barcode, and checkout quickly.
                </p>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl px-4 sm:px-5 py-3 sm:py-4 self-start sm:self-auto">
                <p className="text-xs sm:text-sm text-zinc-500">
                  Available Products
                </p>
                <h3 className="text-xl sm:text-2xl font-black">
                  {products.length}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] md:grid-cols-[1fr_280px] gap-2 sm:gap-3 mt-4 sm:mt-5">
              <div className="relative">
                <BsSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                />
              </div>

              <div className="relative">
                <FiBarChart className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                <input
                  type="text"
                  placeholder="Scan Barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 sm:p-5 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mb-4 sm:mb-5">
                  <FiPackage className="text-2xl sm:text-3xl text-[#9b6b43]" />
                </div>

                <h2 className="text-xl sm:text-2xl font-black">
                  No products found
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                  Try searching another product name or ID.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 pb-6 sm:pb-10">
                {filteredProducts.map((product) => (
                  <button
                    key={product.productId}
                    onClick={() => addToCart(product)}
                    className="text-left bg-[#FAF7F2] border border-zinc-100 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 hover:bg-white hover:shadow-md hover:-translate-y-1 transition"
                  >
                    <div className="h-20 sm:h-28 bg-white rounded-xl sm:rounded-2xl mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-contain p-1.5 sm:p-2"
                        />
                      ) : (
                        <span className="text-zinc-400 text-[10px] sm:text-xs">
                          No Image
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-xs sm:text-sm line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                      {product.name}
                    </h3>

                    <div className="mt-2 sm:mt-3 flex items-end justify-between gap-1 sm:gap-2">
                      <div className="min-w-0">
                        <p className="text-[#9b6b43] font-black text-xs sm:text-sm truncate">
                          Rs. {Number(product.price).toFixed(2)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-zinc-500">
                          Stock: {product.stock}
                        </p>
                      </div>

                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-zinc-950 text-white flex items-center justify-center text-sm flex-shrink-0">
                        +
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cart Section */}
        <aside className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col overflow-hidden min-h-[45vh] lg:min-h-0">
          <div className="p-4 sm:p-5 border-b border-zinc-100 flex justify-between items-center gap-3">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black">Current Order</h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                {cart.length} product{cart.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            <button
              onClick={() => setCart([])}
              className="text-red-500 bg-red-50 hover:bg-red-100 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold flex-shrink-0"
            >
              <BsTrash />
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#FAF7F2] max-h-[40vh] lg:max-h-none">
            {cart.length === 0 ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white flex items-center justify-center mb-4 sm:mb-5">
                  <BsCartX className="text-3xl sm:text-4xl text-[#9b6b43]" />
                </div>

                <h3 className="text-lg sm:text-xl font-black">Cart is empty</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2">
                  Click products to add them to the order.
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-zinc-100 flex gap-2.5 sm:gap-3 relative group hover:shadow-sm transition"
                  >
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-50 text-red-500 rounded-full p-1.5 sm:p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                    >
                      <AiOutlineClose className="text-[10px] sm:text-xs" />
                    </button>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#FAF7F2] overflow-hidden shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiShoppingBag className="text-[#9b6b43] text-sm" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black truncate">
                        {item.name}
                      </h4>

                      <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">
                        Rs. {Number(item.price).toFixed(2)} × {item.quantity}
                      </p>

                      <p className="font-black text-sm sm:text-base mt-1 sm:mt-2">
                        Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-white">
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">
                  Rs. {calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-500 pb-3 sm:pb-4 border-b border-dashed border-zinc-200">
                <span>Tax / Discount</span>
                <span>--</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4 sm:mt-5 mb-4 sm:mb-6">
              <span className="font-black text-sm sm:text-base">Total</span>
              <span className="text-2xl sm:text-3xl font-black text-[#9b6b43]">
                Rs. {calculateTotal().toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button className="py-3 sm:py-4 px-3 sm:px-4 bg-[#FAF7F2] text-zinc-700 rounded-xl sm:rounded-2xl font-bold hover:bg-zinc-200 transition flex items-center justify-center gap-1.5 sm:gap-2 text-sm">
                <BsPrinter />
                Print
              </button>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-black text-white transition flex items-center justify-center gap-2 bg-zinc-950 hover:bg-[#9b6b43] disabled:bg-zinc-300 text-sm sm:text-base"
              >
                Pay Now
              </button>
            </div>
          </div>
        </aside>
      </div>

      <CheckoutPopup
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={calculateTotal()}
        onConfirmPayment={processPayment}
      />
    </div>
  );
}
