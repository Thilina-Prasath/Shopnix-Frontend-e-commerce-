import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiShoppingBag } from "react-icons/fi";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/users/verify-email", {
        params: { token },
      })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Link may be expired.",
        );
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-8 md:p-10 max-w-md w-full text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 sm:gap-3 justify-center mb-6 sm:mb-8"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-950 text-white flex items-center justify-center">
            <FiShoppingBag className="text-xl sm:text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Shop<span className="text-[#9b6b43]">nix</span>
          </h1>
        </Link>

        {status === "loading" && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-black mb-2">
              Email Verified!
            </h2>
            <p className="text-zinc-500 mb-5 sm:mb-6 text-sm sm:text-base">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block bg-zinc-950 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-[#9b6b43] transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="text-5xl sm:text-6xl text-red-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-black mb-2">
              Verification Failed
            </h2>
            <p className="text-zinc-500 mb-5 sm:mb-6 text-sm sm:text-base">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block bg-zinc-950 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-[#9b6b43] transition"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
