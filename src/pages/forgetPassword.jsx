import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiShield,
  FiArrowRight,
  FiShoppingBag,
  FiRefreshCcw,
} from "react-icons/fi";

export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function sendOtp() {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/users/send-otp", {
        email,
      })
      .then(() => {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      })
      .catch(() => {
        toast.error("Failed to send OTP");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function verifyOtp() {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
        email,
        otp: parseInt(otp, 10),
        newPassword,
      })
      .then(() => {
        toast.success("Password reset successfully");
        navigate("/login");
      })
      .catch(() => {
        toast.error("Invalid OTP or reset failed");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f3d9c4,transparent_35%),linear-gradient(135deg,#fffaf5,#f6f1eb,#ffffff)]" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
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
              Account Recovery
            </p>

            <h2 className="text-5xl font-black mt-4 leading-tight">
              Reset your password safely.
            </h2>

            <p className="text-zinc-300 mt-5 leading-relaxed">
              Enter your email, verify the OTP, and create a new secure password
              for your Shopnix account.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              ["Secure", "OTP"],
              ["Fast", "Recovery"],
              ["Safe", "Account"],
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
              <FiShield size={14} className="sm:w-4 sm:h-4" />
              Password Reset
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-4 sm:mt-5 tracking-tight">
              {otpSent ? "Verify OTP" : "Forgot Password"}
            </h2>

            <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base">
              {otpSent
                ? "Enter the OTP and create your new password."
                : "Enter your email address to receive a reset OTP."}
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-4 sm:space-y-5">
              <InputBox
                icon={<FiMail />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <button
                onClick={sendOtp}
                disabled={isLoading}
                className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <InputBox
                icon={<FiShield />}
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />

              <InputBox
                icon={<FiLock />}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />

              <InputBox
                icon={<FiLock />}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />

              <button
                onClick={verifyOtp}
                disabled={isLoading}
                className="w-full bg-zinc-950 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#9b6b43] transition disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password <FiArrowRight />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-full bg-[#FAF7F2] text-zinc-700 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
              >
                <FiRefreshCcw />
                Resend OTP
              </button>
            </div>
          )}

          <p className="text-center mt-6 sm:mt-8 text-zinc-500 text-sm sm:text-base">
            Remember your password?{" "}
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
  );
}

function InputBox({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </span>

      <input
        {...props}
        className="w-full bg-[#FAF7F2] border border-zinc-200 rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-3.5 sm:py-4 outline-none focus:bg-white focus:border-[#9b6b43] transition text-sm sm:text-base"
      />
    </div>
  );
}
