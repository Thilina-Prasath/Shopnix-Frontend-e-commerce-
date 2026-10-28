import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminProductsPage from "./productsPage";
import EditProductPage from "./editProductPage";
import AdminOrdersPage from "./adminOrdersPage";
import AddProductPage from "./addProduct";
import AdminUserPage from "./AdminUserPage";
import AdminReviewPage from "./AdminReviewPage";
import POSPage from "./POSPage";
import AdminBannerPage from "./AdminBannerPage";
import AdminDashboard from "./AdminDashboard";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiStar,
  FiMonitor,
  FiLogOut,
  FiSpeaker,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("loading");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.role !== "admin") {
          toast.error("Access Denied: Admin only");
          navigate("/");
        } else {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      });
  }, [navigate]);

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { path: "/admin/pos", label: "POS System", icon: <FiMonitor /> },
    { path: "/admin/products", label: "Products", icon: <FiPackage /> },
    { path: "/admin/users", label: "Users", icon: <FiUsers /> },
    { path: "/admin/orders", label: "Orders", icon: <FiShoppingCart /> },
    { path: "/admin/reviews", label: "Reviews", icon: <FiStar /> },
    { path: "/admin/banner", label: "Banner", icon: <FiSpeaker /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm font-semibold text-zinc-500">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 sm:w-72 bg-zinc-950 text-white border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#9b6b43] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="font-black text-lg sm:text-xl">S</span>
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                Shop<span className="text-[#c99a6b]">nix</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold tracking-widest">
                ADMIN PANEL
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-5 space-y-1.5 sm:space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all group ${
                isActive(item.path)
                  ? "bg-white text-zinc-950 shadow-lg font-black"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg sm:text-xl flex-shrink-0">
                {item.icon}
              </span>
              <span className="text-sm sm:text-base truncate">
                {item.label}
              </span>

              {isActive(item.path) && (
                <motion.span
                  layoutId="admin-active"
                  className="absolute right-3 sm:right-4 w-2 h-2 rounded-full bg-[#9b6b43]"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 sm:p-5 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-bold text-sm sm:text-base"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center flex-shrink-0"
              >
                <FiMenu />
              </button>

              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-bold text-[#9b6b43] uppercase tracking-widest truncate">
                  Admin Workspace
                </p>
                <h2 className="text-lg sm:text-2xl font-black truncate">
                  Control Center
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-[#FAF7F2] px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                A
              </div>
              <div>
                <p className="text-xs text-zinc-500">Signed in as</p>
                <p className="text-sm font-black">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-7rem)] overflow-hidden">
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/users" element={<AdminUserPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/reviews" element={<AdminReviewPage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/edit-product" element={<EditProductPage />} />
              <Route path="/banner" element={<AdminBannerPage />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
