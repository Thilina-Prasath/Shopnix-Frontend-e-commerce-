import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUsers,
  FiUser,
  FiMail,
  FiHash,
  FiUserCheck,
} from "react-icons/fi";

export default function AdminUserPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/customers`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const deleteCustomer = async (userId) => {
    if (!window.confirm("Delete this customer permanently?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Customer deleted successfully");
      setCustomers((prev) =>
        prev.filter((customer) => customer._id !== userId),
      );
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      [customer.email, customer.firstName, customer.lastName]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [customers, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiUsers />
              Customer Management
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Customers
            </h1>

            <p className="text-sm sm:text-base text-zinc-500 mt-2">
              Manage registered customers and their account details.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <FiSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm sm:text-base" />

            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 py-3 sm:py-4 outline-none focus:border-[#9b6b43] shadow-sm transition text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SummaryCard title="Total Customers" value={customers.length} />
          <SummaryCard
            title="Showing Results"
            value={filteredCustomers.length}
          />
          <SummaryCard title="Customer Accounts" value="Active" />
        </div>

        <section className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-zinc-100">
            <h2 className="text-xl sm:text-2xl font-black">Customer List</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              View and manage all customer accounts.
            </p>
          </div>

          <div className="p-3 sm:p-5 md:p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex justify-center py-20 sm:py-32">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
                </div>
              ) : filteredCustomers.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 sm:py-24 px-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <FiUser className="text-2xl sm:text-3xl text-[#9b6b43]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black">
                    No customers found
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-500 mt-2">
                    Try searching with another name or email.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="customers"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                  className="space-y-3 sm:space-y-4"
                >
                  {filteredCustomers.map((customer) => {
                    const initials =
                      `${customer.firstName?.[0] || ""}${
                        customer.lastName?.[0] || ""
                      }` || "U";

                    return (
                      <motion.div
                        key={customer._id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-[#FAF7F2] border border-zinc-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:bg-white hover:shadow-md transition group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
                          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl border border-zinc-100 flex items-center justify-center text-lg sm:text-xl font-black text-[#9b6b43] shrink-0">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <p className="font-black text-base sm:text-lg truncate">
                                {customer.firstName} {customer.lastName}
                              </p>

                              <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 truncate mt-1">
                                <FiMail className="flex-shrink-0" />
                                <span className="truncate">
                                  {customer.email}
                                </span>
                              </p>

                              <p className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-zinc-400 mt-1 font-mono">
                                <FiHash className="flex-shrink-0" />
                                {customer._id?.slice(-8)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs sm:text-sm font-bold">
                              <FiUserCheck />
                              Customer
                            </span>

                            <button
                              onClick={() => deleteCustomer(customer._id)}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition flex-shrink-0"
                            >
                              <FaTrash className="text-sm sm:text-base" />
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
        </section>
      </motion.div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 border border-zinc-100 shadow-sm">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-3 sm:mb-4">
        <FiUsers className="text-lg sm:text-xl text-[#9b6b43]" />
      </div>

      <p className="text-xs sm:text-sm text-zinc-500">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black mt-1">{value}</h3>
    </div>
  );
}
