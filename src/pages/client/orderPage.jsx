import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered"];

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (showToast = false) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view orders");
        return;
      }

      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOrders(Array.isArray(res.data) ? res.data : []);

      if (showToast) toast.success("Orders refreshed");
    } catch (error) {
      console.error(error);
      if (showToast) toast.error("Failed to refresh orders");
    }
  };

  useEffect(() => {
    fetchOrders().finally(() => setIsLoading(false));
  }, []);

  const refreshOrders = async () => {
    setIsRefreshing(true);
    await fetchOrders(true);
    setIsRefreshing(false);
  };

  const getStatusMeta = (status) => {
    const data = {
      Pending: {
        icon: FiClock,
        className: "bg-orange-50 text-orange-600 border-orange-100",
      },
      Processing: {
        icon: FiPackage,
        className: "bg-blue-50 text-blue-600 border-blue-100",
      },
      Shipped: {
        icon: FiTruck,
        className: "bg-purple-50 text-purple-600 border-purple-100",
      },
      Delivered: {
        icon: FiCheckCircle,
        className: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
    };

    return (
      data[status] || {
        icon: FiClock,
        className: "bg-zinc-100 text-zinc-600 border-zinc-200",
      }
    );
  };

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (activeTab !== "All") {
      list = list.filter((order) => order.orderStatus === activeTab);
    }

    if (search.trim()) {
      list = list.filter((order) =>
        String(order.orderId).toLowerCase().includes(search.toLowerCase()),
      );
    }

    return list;
  }, [orders, activeTab, search]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin mx-auto" />
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-zinc-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <Header />
      <Sidebar />

      <section className="relative overflow-hidden border-b border-zinc-100 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
                <FiShoppingBag />
                Order History
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
                My Orders
              </h1>

              <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
                Track your purchases, delivery status and order details.
              </p>
            </div>

            <button
              onClick={refreshOrders}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-zinc-800 transition disabled:opacity-60 self-start md:self-auto"
            >
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-10">
            <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-white">
              <p className="text-xs sm:text-sm text-zinc-500">Total Orders</p>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">
                {orders.length}
              </h3>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-white">
              <p className="text-xs sm:text-sm text-zinc-500">Delivered</p>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">
                {orders.filter((o) => o.orderStatus === "Delivered").length}
              </h3>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-white col-span-2 md:col-span-1">
              <p className="text-xs sm:text-sm text-zinc-500">Total Spent</p>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">
                Rs. {totalSpent.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-zinc-100">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-center lg:justify-between">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                      activeTab === tab
                        ? "bg-zinc-950 text-white"
                        : "bg-[#FAF7F2] text-zinc-500 hover:text-[#9b6b43]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <FiSearch
                  className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search order ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-3 sm:pr-4 outline-none focus:bg-white focus:border-[#9b6b43] text-sm transition"
                />
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-5">
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-14 sm:py-24"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <FiShoppingBag className="text-2xl sm:text-3xl text-[#9b6b43]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black">
                    No orders found
                  </h2>

                  <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                    Your matching orders will appear here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                  className="space-y-3 sm:space-y-5"
                >
                  {filteredOrders.map((order) => {
                    const meta = getStatusMeta(order.orderStatus);
                    const StatusIcon = meta.icon;

                    return (
                      <motion.div
                        key={order.orderId}
                        variants={{
                          hidden: { opacity: 0, y: 25 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="rounded-2xl sm:rounded-3xl border border-zinc-100 bg-[#FAF7F2] p-3.5 sm:p-5 hover:bg-white hover:shadow-md transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 border-b border-zinc-200 pb-3 sm:pb-5">
                          <div>
                            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono">
                              ORDER #{order.orderId}
                            </p>

                            <p className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mt-1.5 sm:mt-2">
                              <FiClock size={14} />
                              {new Date(order.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-bold ${meta.className}`}
                          >
                            <StatusIcon size={14} />
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="divide-y divide-zinc-200">
                          {order.products?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 sm:gap-4 py-3 sm:py-5"
                            >
                              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white border border-zinc-100 overflow-hidden shrink-0">
                                {item.productInfo?.images?.[0] ? (
                                  <img
                                    src={item.productInfo.images[0]}
                                    alt={item.productInfo?.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <FiPackage />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-black truncate text-sm sm:text-base">
                                  {item.productInfo?.name || "Product"}
                                </h3>

                                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                                  Quantity: {item.quantity}
                                </p>
                              </div>

                              <p className="font-black whitespace-nowrap text-sm sm:text-base">
                                Rs.{" "}
                                {Number(
                                  item.productInfo?.price || 0,
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 sm:pt-5 border-t border-zinc-200">
                          <p className="text-zinc-500 font-medium text-sm sm:text-base">
                            Order Total
                          </p>

                          <p className="text-xl sm:text-2xl font-black">
                            Rs. {Number(order.total || 0).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
