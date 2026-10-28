import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";
import {
  FiEdit3,
  FiSave,
  FiUser,
  FiMail,
  FiLock,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered"];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login to view your profile");
          navigate("/login");
          return;
        }

        const profileRes = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setUserData({
          firstName: profileRes.data.firstName || "",
          lastName: profileRes.data.lastName || "",
          email: profileRes.data.email || "",
          role: profileRes.data.role || "",
        });

        const ordersRes = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders/my-orders",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      passwords.newPassword &&
      passwords.newPassword !== passwords.confirmPassword
    ) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      if (passwords.newPassword) {
        updateData.password = passwords.newPassword;
      }

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Profile updated successfully");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusMeta = (status) => {
    const map = {
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
      map[status] || {
        icon: FiClock,
        className: "bg-zinc-100 text-zinc-600 border-zinc-200",
      }
    );
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;

    return orders.filter(
      (order) => (order.orderStatus || order.status) === activeTab,
    );
  }, [orders, activeTab]);

  const deliveredCount = orders.filter(
    (order) => (order.orderStatus || order.status) === "Delivered",
  ).length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || order.totalPrice || 0),
    0,
  );

  const initials =
    `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}` || "U";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin mx-auto" />
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-zinc-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      <Header />
      <Sidebar />

      <section className="bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)] border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] bg-zinc-950 text-white flex items-center justify-center text-xl sm:text-3xl font-black shadow-lg">
              {initials}
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
                <FiUser />
                My Account
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
                {userData.firstName} {userData.lastName}
              </h1>

              <p className="flex items-center gap-2 text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base break-all">
                <FiMail className="shrink-0" />
                {userData.email}
              </p>
            </div>

            {userData.role === "admin" && (
              <span className="inline-flex items-center gap-2 bg-zinc-950 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold self-start">
                <FiShield />
                Admin
              </span>
            )}
          </motion.div>

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
                {deliveredCount}
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-5 sm:space-y-8">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-zinc-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
              <FiEdit3 className="text-lg sm:text-xl text-[#9b6b43]" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Personal Details
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                Update your name and account security.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-7"
          >
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                Email Address
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-zinc-400 cursor-not-allowed pr-10 sm:pr-12 text-sm sm:text-base"
                />
                <FiMail
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />
              </div>
            </div>

            <div className="pt-5 sm:pt-7 border-t border-zinc-100">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                  <FiLock className="text-[#9b6b43]" size={16} />
                </div>

                <div>
                  <h3 className="font-black text-sm sm:text-base">Security</h3>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    Leave password fields empty if you do not want to change it.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-zinc-950 text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition disabled:opacity-60 text-sm sm:text-base"
            >
              <FiSave />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-zinc-100">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                <FiShoppingBag className="text-lg sm:text-xl text-[#9b6b43]" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black">My Orders</h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Track your recent purchases.
                </p>
              </div>
            </div>

            <Link
              to="/orders"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#9b6b43]"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="flex gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 overflow-x-auto scrollbar-hide">
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

          <div className="p-4 sm:p-6 md:p-8">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiShoppingBag className="text-2xl sm:text-3xl text-[#9b6b43]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black">
                  No orders found
                </h3>
                <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                  Your matching orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredOrders.slice(0, 5).map((order) => {
                  const status = order.orderStatus || order.status || "Pending";
                  const meta = getStatusMeta(status);
                  const StatusIcon = meta.icon;

                  return (
                    <motion.div
                      key={order.orderId || order._id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-[#FAF7F2] border border-zinc-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 hover:bg-white hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                          <FiPackage className="text-[#9b6b43]" size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-black truncate text-sm sm:text-base">
                            Order #{order.orderId || order._id?.slice(-6)}
                          </p>
                          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                            {new Date(
                              order.date || order.createdAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <p className="font-black text-sm sm:text-base">
                          Rs.{" "}
                          {Number(
                            order.total || order.totalPrice || 0,
                          ).toLocaleString()}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-bold ${meta.className}`}
                        >
                          <StatusIcon size={14} />
                          {status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
