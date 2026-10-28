import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {
  FiShoppingBag,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleEmailRegister() {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/register",
        {
          email: email.trim(),
          password,
        },
      );

      toast.success(
        res.data.message ||
          "Registration successful! Please check your email to verify your account.",
      );
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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

        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);

        if (res.data.role === "admin") navigate("/admin/");
        else navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleEmailRegister();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
        <div className="hidden lg:flex relative bg-zinc-950 text-white p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#9b6b43,transparent_35%)] opacity-60" />

          <Link to="/" className="relative z-10 inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#9b6b43] flex items-center justify-center">
              <FiShoppingBag className="text-2xl" />
            </div>

            <h1 className="text-3xl font-black">
              Shop<span className="text-[#c99a6b]">nix</span>
            </h1>
          </Link>

          <div className="relative z-10">
            <p className="uppercase tracking-widest text-sm text-[#c99a6b] font-bold">
              Create Account
            </p>

            <h2 className="text-5xl font-black mt-4 leading-tight">
              Join Shopnix and start shopping smarter.
            </h2>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              Create your account to save your wishlist, track orders, and enjoy
              a smooth shopping experience.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              ["Save", "Wishlist"],
              ["Track", "Orders"],
              ["Easy", "Checkout"],
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
        </div>

        <div className="p-5 sm:p-8 md:p-10 lg:p-14">
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
              <FiUserPlus size={14} className="sm:w-4 sm:h-4" />
              New Account
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-4 sm:mt-5 tracking-tight">
              Create Account
            </h2>

            <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
              Register to continue shopping with Shopnix.
            </p>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            <button
              onClick={googleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white border border-zinc-200 hover:border-[#9b6b43] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5 gap-x-2.5"
                  />
                  Continue with Google
                </>
              )}
            </button>

            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onSuccess={async (response) => {
                setIsFacebookLoading(true);

                try {
                  const res = await axios.post(
                    import.meta.env.VITE_BACKEND_URL +
                      "/api/users/login/facebook",
                    {
                      accessToken: response.accessToken,
                    },
                  );

                  toast.success("Login successful!");
                  localStorage.setItem("token", res.data.token);

                  if (res.data.role === "admin") navigate("/admin/");
                  else navigate("/");
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Facebook login failed",
                  );
                } finally {
                  setIsFacebookLoading(false);
                }
              }}
              onFail={() => {
                toast.error("Facebook login failed");
                setIsFacebookLoading(false);
              }}
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  disabled={isFacebookLoading}
                  className="w-full bg-white border border-zinc-200 hover:border-[#9b6b43] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 font-bold text-sm sm:text-base transition"
                >
                  {isFacebookLoading ? (
                    <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <img
                        src="./facebooklogo.png"
                        alt="Facebook"
                        className="w-5 h-5 gap-x-2.5"
                      />
                      Continue with Facebook
                    </>
                  )}
                </button>
              )}
            />

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100" />
              </div>

              <div className="relative text-center">
                <span className="bg-white px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-zinc-400">
                  OR REGISTER WITH EMAIL
                </span>
              </div>
            </div>

            <InputBox
              icon={<FiMail />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Email address"
              error={errors.email}
            />

            <div>
              <div className="relative">
                <FiLock
                  className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Password"
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
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleEmailRegister}
              disabled={isLoading}
              className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register <FiArrowRight />
                </>
              )}
            </button>

            <p className="text-center pt-3 sm:pt-4 text-zinc-500 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#9b6b43] hover:underline font-black"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>

        <input
          {...props}
          className={`w-full bg-[#FAF7F2] border rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-3.5 sm:py-4 outline-none focus:bg-white transition text-sm sm:text-base ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-zinc-200 focus:border-[#9b6b43]"
          }`}
        />
      </div>

      {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
    </div>
  );
}
