import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiX,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiClock,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatus = (order) => order.orderStatus || order.status || "Pending";

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`Order marked as ${newStatus}`);

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? { ...order, status: newStatus, orderStatus: newStatus }
            : order,
        ),
      );

      if (activeOrder?.orderId === orderId) {
        setActiveOrder((prev) => ({
          ...prev,
          status: newStatus,
          orderStatus: newStatus,
        }));
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      [order.orderId, order.name, order.email, getStatus(order)]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [orders, searchQuery]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: FiShoppingCart,
    },
    {
      title: "Pending",
      value: orders.filter((o) => getStatus(o).toLowerCase() === "pending")
        .length,
      icon: FiClock,
    },
    {
      title: "Shipped",
      value: orders.filter((o) => getStatus(o).toLowerCase() === "shipped")
        .length,
      icon: FiTruck,
    },
    {
      title: "Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: FiCheckCircle,
    },
  ];

  const statusClass = (status) => {
    const s = status?.toLowerCase();

    if (s === "delivered")
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "shipped")
      return "bg-purple-50 text-purple-600 border-purple-100";
    if (s === "processing") return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === "cancelled") return "bg-red-50 text-red-600 border-red-100";

    return "bg-orange-50 text-orange-600 border-orange-100";
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
              <FiPackage />
              Order Management
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Orders
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Manage customer orders, status updates, and product details.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <FiSearch
              className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Search by order ID, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-2xl px-10 sm:px-12 py-3 sm:py-4 outline-none focus:border-[#9b6b43] shadow-sm transition text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-zinc-100 shadow-sm"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-3 sm:mb-5">
                  <Icon className="text-lg sm:text-xl text-[#9b6b43]" />
                </div>

                <p className="text-xs sm:text-sm text-zinc-500">{stat.title}</p>
                <h3 className="text-xl sm:text-3xl font-black mt-1 break-words">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Recent Orders</h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Showing {filteredOrders.length} orders
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-5">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex justify-center py-20 sm:py-32">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-14 sm:py-24 px-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <FiPackage className="text-2xl sm:text-3xl text-[#9b6b43]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black">
                    No orders found
                  </h3>
                  <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                    Try changing your search keyword.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                  className="space-y-3 sm:space-y-4"
                >
                  {filteredOrders.map((order) => {
                    const status = getStatus(order);

                    return (
                      <motion.div
                        key={order.orderId}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        onClick={() => {
                          setActiveOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="bg-[#FAF7F2] border border-zinc-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 hover:bg-white hover:shadow-md transition cursor-pointer group"
                      >
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-5">
                          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-[#9b6b43] border border-zinc-100 shrink-0">
                              <FiPackage size={20} className="sm:w-6 sm:h-6" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-mono text-[10px] sm:text-xs text-zinc-400">
                                ORDER #{order.orderId}
                              </p>
                              <p className="font-black text-base sm:text-lg truncate">
                                {order.name}
                              </p>
                              <p className="text-zinc-500 text-xs sm:text-sm truncate">
                                {order.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 xl:justify-end">
                            <div className="text-left xl:text-right">
                              <p className="text-lg sm:text-xl font-black">
                                Rs. {Number(order.total || 0).toLocaleString()}
                              </p>
                              <p className="text-[10px] sm:text-xs text-zinc-500">
                                {order.products?.length || 0} items
                              </p>
                            </div>

                            <span
                              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border capitalize ${statusClass(
                                status,
                              )}`}
                            >
                              {status}
                            </span>

                            <button className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:text-[#9b6b43] transition">
                              <FiEye size={18} className="sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && activeOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-[2rem] max-w-4xl w-full max-h-[92vh] overflow-hidden border border-zinc-100 shadow-2xl"
            >
              <div className="p-4 sm:p-6 md:p-8 border-b border-zinc-100 flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#9b6b43] font-bold truncate">
                    ORDER #{activeOrder.orderId}
                  </p>
                  <h2 className="text-xl sm:text-3xl font-black mt-1">
                    Order Details
                  </h2>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center hover:bg-zinc-200 transition shrink-0"
                >
                  <FiX size={20} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8 overflow-auto max-h-[70vh]">
                <div className="mb-5 sm:mb-8">
                  <p className="text-xs sm:text-sm font-bold text-zinc-500 mb-2.5 sm:mb-3">
                    Current Status
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {[
                      "Pending",
                      "Processing",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateOrderStatus(activeOrder.orderId, status)
                        }
                        className={`px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition border ${
                          getStatus(activeOrder).toLowerCase() ===
                          status.toLowerCase()
                            ? "bg-zinc-950 text-white border-zinc-950"
                            : "bg-[#FAF7F2] text-zinc-600 border-zinc-100 hover:border-[#9b6b43]"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-5">
                  Products
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {activeOrder.products?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 sm:gap-5 bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-zinc-100"
                    >
                      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-100 shrink-0">
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
                        <p className="font-black truncate text-sm sm:text-base">
                          {item.productInfo?.name || "Product"}
                        </p>

                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-black whitespace-nowrap text-sm sm:text-base">
                        Rs.{" "}
                        {Number(item.productInfo?.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-zinc-500 font-bold text-sm sm:text-base">
                    Order Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-black">
                    Rs. {Number(activeOrder.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
