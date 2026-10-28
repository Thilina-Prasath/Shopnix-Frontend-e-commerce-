import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AnnouncementBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/banner",
        );

        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setBanners(data.filter((banner) => banner && banner.isActive));
      } catch (error) {
        console.log("No active banners found.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, banners]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (isLoading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="w-full bg-[#FAF7F2] px-3 sm:px-5 pb-4 sm:pb-6">
      <div className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-[2rem] overflow-hidden bg-zinc-950 shadow-xl group">
        <div className="relative h-40 sm:h-56 md:h-72 lg:h-[340px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Link
                to={currentBanner.targetLink || "/products"}
                className="block w-full h-full"
              >
                <img
                  src={currentBanner.imageUrl}
                  alt="Special Offer"
                  className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/15 hover:bg-white text-white hover:text-zinc-950 backdrop-blur-md border border-white/20 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Previous banner"
              >
                <FiChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/15 hover:bg-white text-white hover:text-zinc-950 backdrop-blur-md border border-white/20 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Next banner"
              >
                <FiChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-6 sm:w-8 bg-white"
                        : "w-1.5 sm:w-2 bg-white/45 hover:bg-white"
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
