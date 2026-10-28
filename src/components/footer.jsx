import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    ["Men's Fashion", "/products?category=Men"],
    ["Women's Fashion", "/products?category=Women"],
    ["Footwear", "/products?category=Footwear"],
    ["Accessories", "/products?category=Accessories"],
  ];

  const quickLinks = [
    ["About Us", "/about"],
    ["Contact", "/contact"],
    ["Wishlist", "/wishlist"],
    ["Track Order", "/orders"],
    ["Reviews", "/reviews"],
  ];

  const supportLinks = [
    ["FAQs", "/faq"],
    ["Shipping Policy", "/shipping"],
    ["Returns & Refunds", "/returns"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
  ];

  return (
    <footer className="relative overflow-hidden bg-[#FAF7F2] text-zinc-900 border-t border-[#e8d9c8]">
      {/* Soft warm accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e8b98a_0%,transparent_40%)] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#9b6b43] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xl sm:text-2xl">
                  S
                </span>
              </div>
              <span className="font-black text-2xl sm:text-3xl tracking-tight text-zinc-900">
                Shop<span className="text-[#9b6b43]">nix</span>
              </span>
            </Link>

            <p className="text-zinc-600 max-w-md leading-relaxed text-sm sm:text-base">
              Premium online shopping destination for fashion, electronics, home
              and lifestyle products across Sri Lanka.
            </p>

            <div className="space-y-2.5 sm:space-y-3 mt-5 sm:mt-7 text-xs sm:text-sm text-zinc-600">
              <p className="flex items-center gap-2.5 sm:gap-3">
                <FiMapPin className="text-[#9b6b43] shrink-0" size={16} />
                Colombo, Sri Lanka
              </p>
              <p className="flex items-center gap-2.5 sm:gap-3">
                <FiPhone className="text-[#9b6b43] shrink-0" size={16} />
                +94 77 123 4567
              </p>
              <p className="flex items-center gap-2.5 sm:gap-3">
                <FiMail className="text-[#9b6b43] shrink-0" size={16} />
                support@shopnix.lk
              </p>
            </div>

            <div className="flex gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#e8d9c8] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-[#9b6b43] hover:border-[#9b6b43] transition-all duration-300 shadow-sm"
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                ),
              )}
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#e8d9c8] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
          <p>© {currentYear} Shopnix. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link to="/privacy" className="hover:text-[#9b6b43] transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#9b6b43] transition">
              Terms
            </Link>
            <span className="text-zinc-400">Made with ❤️ in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-black text-base sm:text-lg mb-4 sm:mb-5 text-zinc-900">
        {title}
      </h3>

      <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
        {links.map(([label, path]) => (
          <li key={label}>
            <Link
              to={path}
              className="text-zinc-500 hover:text-[#9b6b43] transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
