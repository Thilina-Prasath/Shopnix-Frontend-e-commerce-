import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiHome,
  FiHeart,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();

  const navLinks = [
    {
      to: "/",
      label: "Home",
      icon: <FiHome size={18} className="sm:w-5 sm:h-5" />,
    },
    {
      to: "/products",
      label: "Shop",
      icon: <FiShoppingBag size={18} className="sm:w-5 sm:h-5" />,
    },
    {
      to: "/orders",
      label: "Orders",
      icon: <FiPackage size={18} className="sm:w-5 sm:h-5" />,
    },
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: <FiHeart size={18} className="sm:w-5 sm:h-5" />,
    },
    {
      to: "/profile",
      label: "Account",
      icon: <FiUser size={18} className="sm:w-5 sm:h-5" />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="lg:hidden fixed bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-[9999]">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-2xl border border-white/70 shadow-2xl rounded-[1.5rem] sm:rounded-[2rem] px-1.5 sm:px-2 py-1.5 sm:py-2">
          <div className="flex items-center justify-between">
            {navLinks.map((link) => {
              const active = isActive(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-label={link.label}
                  aria-current={active ? "page" : undefined}
                  className="relative flex-1 flex flex-col items-center justify-center py-0.5 sm:py-1"
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                      active
                        ? "bg-zinc-950 text-white shadow-lg"
                        : "text-zinc-400 hover:text-[#9b6b43] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {link.icon}

                    {active && (
                      <motion.div
                        layoutId="bottom-nav-active"
                        className="absolute inset-0 rounded-xl sm:rounded-2xl bg-zinc-950 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>

                  <motion.span
                    animate={{
                      color: active ? "#18181b" : "#a1a1aa",
                      scale: active ? 1.04 : 1,
                    }}
                    className="text-[9px] sm:text-[10px] font-bold mt-0.5 sm:mt-1"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="h-20 sm:h-24 lg:hidden" />
    </>
  );
}
