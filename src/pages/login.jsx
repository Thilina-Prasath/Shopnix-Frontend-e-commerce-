import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShoppingBag,
  FiMail,
  FiLock,
} from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoogleLoading(true);

      try {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/users/login/google",
          {
            accessToken: response.access_token,
          },
        );

        toast.success("Welcome back!");
        localStorage.setItem("token", res.data.token);

        if (res.data.role?.startsWith("admin")) {
          navigate("/admin/");
        } else {
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed");
      setIsGoogleLoading(false);
    },
  });

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      toast.success("Welcome back!");
      localStorage.setItem("token", response.data.token);

      if (response.data.role?.startsWith("admin")) {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Invalid credentials";

      if (error.response?.status === 403 && errMsg.includes("verify")) {
        toast.error(
          "Please verify your email before logging in. Check your inbox.",
        );
      } else {
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex relative bg-zinc-950 text-white p-12 flex-col justify-between overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#9b6b43,transparent_35%)] opacity-60" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9b6b43] flex items-center justify-center">
                <FiShoppingBag className="text-2xl" />
              </div>

              <h1 className="text-3xl font-black">
                Shop<span className="text-[#c99a6b]">nix</span>
              </h1>
            </Link>
          </div>

          <div className="relative z-10">
            <p className="uppercase tracking-widest text-sm text-[#c99a6b] font-bold">
              Welcome Back
            </p>

            <h2 className="text-5xl font-black mt-4 leading-tight">
              Continue your shopping journey.
            </h2>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              Sign in to manage your orders, wishlist, cart and Shopnix account
              securely.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              ["Fast", "Delivery"],
              ["Secure", "Checkout"],
              ["Easy", "Returns"],
            ].map(([top, bottom]) => (
              <div
                key={top}
                className="bg-white/10 border border-white/10 rounded-3xl p-4"
              >
                <p className="text-xl font-black">{top}</p>
                <p className="text-xs text-zinc-400">{bottom}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-8 md:p-10 lg:p-14"
        >
          <div className="lg:hidden mb-6 sm:mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-zinc-950 text-white flex items-center justify-center">
                <FiShoppingBag size={18} className="sm:w-5 sm:h-5" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black">
                Shop<span className="text-[#9b6b43]">nix</span>
              </h1>
            </Link>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiLock size={14} className="sm:w-4 sm:h-4" />
              Secure Login
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-4 sm:mt-5 tracking-tight">
              Welcome Back
            </h2>

            <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
              Login to continue shopping with Shopnix.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={`w-full bg-[#FAF7F2] border rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-3.5 sm:py-4 outline-none focus:bg-white transition text-sm sm:text-base ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-zinc-200 focus:border-[#9b6b43]"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5 sm:mb-2">
                Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#FAF7F2] border rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-12 sm:pr-14 py-3.5 sm:py-4 outline-none focus:bg-white transition text-sm sm:text-base ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-zinc-200 focus:border-[#9b6b43]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#9b6b43]"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <FiEye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <p className="text-right">
              <Link
                to="/forgot-password"
                className="block text-xs sm:text-sm font-bold text-zinc-700 mb-2 text-right cursor-pointer"
              >
                Forgot Password?
              </Link>
            </p>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100" />
              </div>

              <div className="relative text-center">
                <span className="bg-white px-4 text-xs font-bold text-zinc-400">
                  OR
                </span>
              </div>
            </div>

            <button
              onClick={googleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white border border-zinc-200 hover:border-[#9b6b43] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <GrGoogle className="text-lg sm:text-xl" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <p className="text-center mt-6 sm:mt-8 text-zinc-500 text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#9b6b43] hover:underline font-black"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
