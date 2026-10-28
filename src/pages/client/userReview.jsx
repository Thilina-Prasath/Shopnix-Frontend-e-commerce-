import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiCamera, FiTrash2, FiSend } from "react-icons/fi";

export default function UserReview({ productId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      let uploadedImageUrls = [];
      if (images.length > 0) {
        const toastId = toast.loading("Uploading images...");
        try {
          const uploadPromises = images.map((img) => mediaUpload(img));
          uploadedImageUrls = await Promise.all(uploadPromises);
          toast.dismiss(toastId);
        } catch (uploadError) {
          toast.dismiss(toastId);
          toast.error("Failed to upload images");
          return;
        }
      }

      const reviewData = {
        rating: Number(rating),
        comment: comment.trim(),
        productId,
        images: uploadedImageUrls,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Thank you for your review! ❤️");

      // Reset form
      setRating(5);
      setComment("");
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
      className="bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10"
    >
      <div className="text-center mb-6 sm:mb-10">
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-black font-bold tracking-tighter mb-2 sm:mb-3">
          Share Your Experience
        </h3>
        <p className="text-black/70 text-xs sm:text-sm max-w-[600px] mx-auto">
          Help other customers make better choices
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
        {/* Star Rating */}
        <div className="flex justify-center">
          <div className="flex gap-1 sm:gap-2">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredStar(starValue)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`text-3xl sm:text-4xl md:text-5xl transition-all ${starValue <= (hoveredStar || rating) ? "text-yellow-400" : "text-zinc-700"}`}
                >
                  ★
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-black mb-2 sm:mb-3 font-bold">
            YOUR REVIEW
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full bg-zinc-50 border-2 border-black rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3.5 sm:py-5 focus:border-white/40 outline-none resize-y min-h-[100px] sm:min-h-[140px] text-sm sm:text-base"
            placeholder="What did you like? What should others know?"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-black font-bold mb-2 sm:mb-3">
            ADD PHOTOS (OPTIONAL)
          </label>

          <label className="border-2 border-dashed bg-zinc-50 hover:border-white/40 rounded-2xl sm:rounded-3xl h-28 sm:h-40 flex flex-col items-center justify-center cursor-pointer transition-all group">
            <FiCamera className="text-2xl sm:text-4xl text-black mb-1.5 sm:mb-2" />
            <p className="text-xs sm:text-sm text-black">Upload images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide">
              {imagePreviews.map((preview, index) => (
                <motion.div key={index} className="relative flex-shrink-0">
                  <img
                    src={preview}
                    alt=""
                    className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl sm:rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                  >
                    <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="w-full bg-gradient-to-r from-[#9b6b43] via-[#b8875a] to-[#c9a07a] text-black py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-xl flex items-center justify-center gap-2 sm:gap-3"
        >
          {isSubmitting ? (
            "Submitting Review..."
          ) : (
            <>
              Submit Review <FiSend />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
