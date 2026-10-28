import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDollarSign,
  FiUsers,
  FiBox,
  FiAlertTriangle,
  FiTrendingUp,
  FiShoppingBag,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/admin/dashboard",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);

      setStats({
        orders: {
          pending: 45,
          processing: 28,
          shipped: 85,
          delivered: 320,
          cancelled: 12,
          todayCount: 18,
          totalCount: 1560,
        },
        revenue: {
          today: 45000,
          yesterday: 38500,
          thisWeek: 285000,
          total: 12500000,
        },
        inventory: {
          lowStock: 15,
          outOfStock: 4,
          totalProducts: 450,
        },
        users: {
          total: 2850,
        },
        paymentStatus: {
          paid: 1420,
          unpaid: 120,
          refunded: 20,
        },
        chartData: [
          { date: "Jan", revenue: 450000, orders: 120 },
          { date: "Feb", revenue: 520000, orders: 145 },
          { date: "Mar", revenue: 480000, orders: 130 },
          { date: "Apr", revenue: 610000, orders: 180 },
          { date: "May", revenue: 590000, orders: 165 },
          { date: "Jun", revenue: 750000, orders: 210 },
          { date: "Jul", revenue: 820000, orders: 240 },
          { date: "Aug", revenue: 780000, orders: 220 },
          { date: "Sep", revenue: 910000, orders: 260 },
          { date: "Oct", revenue: 850000, orders: 245 },
          { date: "Nov", revenue: 1150000, orders: 320 },
          { date: "Dec", revenue: 1450000, orders: 410 },
        ],
        bestSellers: [
          { name: "Luxury Men's Watch", sales: 124, price: 15000 },
          { name: "Wireless Earbuds Pro", sales: 98, price: 8500 },
          { name: "Leather Crossbody Bag", sales: 85, price: 12000 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
        <div className="text-center">
          <div className="h-12 w-12 sm:h-14 sm:w-14 animate-spin rounded-full border-4 border-zinc-200 border-t-[#9b6b43] mx-auto" />
          <p className="mt-4 text-sm font-semibold text-zinc-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, subtitle }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl sm:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-zinc-100"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-4 sm:mb-5">
        <Icon className="text-lg sm:text-xl text-[#9b6b43]" />
      </div>

      <p className="text-xs sm:text-sm text-zinc-500">{title}</p>
      <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 mt-1 break-words">
        {value}
      </h4>

      {subtitle && <p className="text-xs text-zinc-400 mt-2">{subtitle}</p>}
    </motion.div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl text-sm">
          <p className="text-xs sm:text-sm text-zinc-400">
            {payload[0].payload.date}
          </p>
          <p className="text-base sm:text-lg font-black text-[#c99a6b]">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }

    return null;
  };

  const dashboardStats = stats || {};
  const revenue = dashboardStats.revenue || {};
  const orders = dashboardStats.orders || {};
  const inventory = dashboardStats.inventory || {};
  const users = dashboardStats.users || {};
  const paymentStatus = dashboardStats.paymentStatus || {};
  const chartData = Array.isArray(dashboardStats.chartData)
    ? dashboardStats.chartData
    : [];
  const bestSellers = Array.isArray(dashboardStats.bestSellers)
    ? dashboardStats.bestSellers
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiTrendingUp className="text-sm sm:text-base" />
              Store Overview
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-3 sm:mt-4 tracking-tight text-zinc-950">
              Admin Dashboard
            </h1>

            <p className="text-sm sm:text-base text-zinc-500 mt-2 max-w-md">
              Monitor sales, orders, customers, inventory and payment activity.
            </p>
          </div>

          <div className="bg-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm border border-zinc-100 text-xs sm:text-sm font-bold text-zinc-600 self-start sm:self-auto">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <StatCard
            title="Today's Revenue"
            value={`Rs. ${Number(revenue.today || 0).toLocaleString()}`}
            icon={FiDollarSign}
            subtitle={`${orders.todayCount || 0} orders today`}
          />

          <StatCard
            title="This Week"
            value={`Rs. ${Number(revenue.thisWeek || 0).toLocaleString()}`}
            icon={FiTrendingUp}
          />

          <StatCard
            title="Total Revenue"
            value={`Rs. ${Number(revenue.total || 0).toLocaleString()}`}
            icon={FiDollarSign}
          />

          <StatCard
            title="Total Users"
            value={users.total || 0}
            icon={FiUsers}
          />
        </div>

        {/* Store Performance + Quick Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-zinc-950 text-white rounded-[1.75rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#9b6b43,transparent_35%)] opacity-50" />

            <div className="relative z-10">
              <p className="uppercase tracking-widest text-xs sm:text-sm text-[#c99a6b] font-bold">
                Store Performance
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-3 sm:mt-4">
                Your store is growing steadily.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 mt-3 sm:mt-4 max-w-2xl">
                Today’s sales, orders, and customer activity are shown here to
                help you make quick business decisions.
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-white/10 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Today Orders
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">
                    {orders.todayCount || 0}
                  </h3>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Total Orders
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">
                    {orders.totalCount || 0}
                  </h3>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                  <p className="text-zinc-400 text-xs sm:text-sm">Products</p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">
                    {inventory.totalProducts || 0}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 border border-zinc-100 shadow-sm">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center mb-4 sm:mb-5">
              <FiShoppingBag className="text-xl sm:text-2xl text-[#9b6b43]" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-500">Quick Summary</p>
            <h3 className="text-3xl sm:text-4xl font-black mt-2">
              {orders.delivered || 0}
            </h3>
            <p className="text-sm text-zinc-500 mt-2">
              Delivered orders completed.
            </p>

            <div className="mt-5 sm:mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Pending</span>
                <span className="font-black">{orders.pending || 0}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Processing</span>
                <span className="font-black">{orders.processing || 0}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipped</span>
                <span className="font-black">{orders.shipped || 0}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Order Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          <StatCard
            title="Pending"
            value={orders.pending || 0}
            icon={FiClock}
          />
          <StatCard
            title="Processing"
            value={orders.processing || 0}
            icon={FiBox}
          />
          <StatCard
            title="Shipped"
            value={orders.shipped || 0}
            icon={FiTruck}
          />
          <StatCard
            title="Delivered"
            value={orders.delivered || 0}
            icon={FiCheckCircle}
          />
          <StatCard
            title="Cancelled"
            value={orders.cancelled || 0}
            icon={FiXCircle}
          />
        </div>

        {/* Inventory + Yesterday Revenue */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <StatCard
            title="Low Stock"
            value={inventory.lowStock || 0}
            icon={FiAlertTriangle}
          />
          <StatCard
            title="Out of Stock"
            value={inventory.outOfStock || 0}
            icon={FiXCircle}
          />
          <StatCard
            title="Total Products"
            value={inventory.totalProducts || 0}
            icon={FiBox}
          />
          <StatCard
            title="Yesterday Revenue"
            value={`Rs. ${Number(revenue.yesterday || 0).toLocaleString()}`}
            icon={FiDollarSign}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-sm border border-zinc-100">
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 mb-4 sm:mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-[#9b6b43] flex-shrink-0" />
            Revenue Overview
          </h3>

          <div className="h-[260px] sm:h-[320px] md:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b6b43" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#9b6b43" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f4f4f5"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `Rs.${value / 1000}k`}
                  width={45}
                />

                <RechartsTooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#9b6b43"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Sellers + Payment Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-sm border border-zinc-100">
            <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">
              Best Selling Products
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {bestSellers.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4 bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-4 sm:p-5"
                >
                  <div className="min-w-0">
                    <p className="font-black text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-500">
                      {item.sales} sales
                    </p>
                  </div>

                  <p className="font-black text-sm sm:text-base whitespace-nowrap">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-sm border border-zinc-100">
            <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">
              Payment Status
            </h3>

            <div className="h-[220px] sm:h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Paid", value: paymentStatus.paid || 0 },
                    { name: "Unpaid", value: paymentStatus.unpaid || 0 },
                    { name: "Refunded", value: paymentStatus.refunded || 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#9b6b43" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
