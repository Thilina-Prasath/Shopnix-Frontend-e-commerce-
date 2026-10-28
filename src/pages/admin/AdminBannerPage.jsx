import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage,
  FiLink,
  FiSave,
  FiTrash2,
  FiPlus,
  FiSpeaker,
  FiUploadCloud,
} from "react-icons/fi";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [targetLink, setTargetLink] = useState("/");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const targetOptions = [
    { label: "Home Page", value: "/" },
    { label: "All Products", value: "/products" },
    { label: "Men's Clothing", value: "/products?category=Men" },
    { label: "Women's Clothing", value: "/products?category=Women" },
    { label: "Footwear", value: "/products?category=Footwear" },
    { label: "Accessories", value: "/products?category=Accessories" },
    { label: "Flash Sale", value: "/products?category=Sale" },
  ];

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/banner`,
      );
      setBanners(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load banners");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login as admin");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a banner image");
      return;
    }

    setIsLoading(true);

    try {
      const toastId = toast.loading("Uploading banner...");
      const finalImageUrl = await mediaUpload(imageFile);
      toast.dismiss(toastId);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/banner`,
        {
          imageUrl: finalImageUrl,
          targetLink,
          isActive: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Banner added successfully");
      setImageFile(null);
      setPreviewUrl("");
      setTargetLink("/");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to add banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/banner/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Banner deleted");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-zinc-200 border-t-[#9b6b43] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm text-xs sm:text-sm font-bold text-[#9b6b43]">
              <FiSpeaker />
              Banner Management
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-3 sm:mt-4 tracking-tight">
              Banners
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Upload and manage homepage announcement banners.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-3.5 sm:py-4 border border-zinc-100 shadow-sm self-start">
            <p className="text-xs sm:text-sm text-zinc-500">Active Banners</p>
            <h3 className="text-2xl sm:text-3xl font-black">
              {banners.length}
            </h3>
          </div>
        </div>

        <section className="grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 mb-5 sm:mb-8">
          <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF7F2] flex items-center justify-center shrink-0">
                <FiUploadCloud className="text-lg sm:text-xl text-[#9b6b43]" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Upload New Banner
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Choose a banner image and destination page.
                </p>
              </div>
            </div>

            <div className="relative h-48 sm:h-72 md:h-80 rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-zinc-200 bg-[#FAF7F2] overflow-hidden group hover:border-[#9b6b43] transition">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 px-4">
                  <FiImage className="text-3xl sm:text-5xl mb-3 sm:mb-4 text-[#9b6b43]" />
                  <p className="font-bold text-zinc-600 text-sm sm:text-base text-center">
                    Click to upload banner
                  </p>
                  <p className="text-xs sm:text-sm mt-1 text-center">
                    Recommended: wide landscape image
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-zinc-950 text-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#9b6b43,transparent_35%)] opacity-60" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center mb-4 sm:mb-6">
                <FiLink className="text-lg sm:text-xl text-[#c99a6b]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black">
                Banner Destination
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2 mb-4 sm:mb-6">
                Select where customers should go after clicking the banner.
              </p>

              <select
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 outline-none focus:border-[#c99a6b] text-white text-sm sm:text-base"
              >
                {targetOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="text-black"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddBanner}
                disabled={isLoading || !imageFile}
                className="mt-5 sm:mt-auto w-full bg-white text-zinc-950 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#c99a6b] hover:text-white transition disabled:opacity-50"
              >
                <FiSave />
                {isLoading ? "Uploading..." : "Add Banner"}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl sm:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Existing Banners
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Manage uploaded banners and remove outdated ones.
              </p>
            </div>

            <FiPlus className="text-[#9b6b43] text-xl sm:text-2xl shrink-0" />
          </div>

          <div className="p-3 sm:p-5 md:p-6">
            {banners.length === 0 ? (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiImage className="text-2xl sm:text-3xl text-[#9b6b43]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black">
                  No banners yet
                </h3>
                <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                  Add your first banner above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AnimatePresence>
                  {banners.map((banner) => (
                    <motion.div
                      key={banner._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#FAF7F2] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-zinc-100 hover:bg-white hover:shadow-md transition"
                    >
                      <div className="relative h-36 sm:h-44">
                        <img
                          src={banner.imageUrl}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black text-[#9b6b43]">
                          Active
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-bold">
                          Target Link
                        </p>

                        <p className="font-black mt-1 truncate text-sm sm:text-base">
                          {banner.targetLink}
                        </p>

                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="mt-4 sm:mt-5 w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition"
                        >
                          <FiTrash2 />
                          Delete Banner
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
