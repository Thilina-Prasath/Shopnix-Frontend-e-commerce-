import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";

export default function ProductCard({ product }) {
  const discount =
    product.labelledPrice > product.price
      ? Math.round(
          ((product.labelledPrice - product.price) / product.labelledPrice) *
            100,
        )
      : 0;

  const inStock = product.isAvailable && product.stock > 0;

  return (
    <Link
      to={`/overview/${encodeURIComponent(product.productId)}`}
      // Width එක max-w-[260px] දක්වා අඩු කළා, rounded-2xl කළා
      className="group/card block w-full max-w-[160px] sm:max-w-[200px] md:max-w-[220px] mx-auto bg-white overflow-hidden border border-white/40 transition-all duration-500 hover:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.12)] hover:border-white/20 relative"
    >
      {/* Image Section */}
      <div className="relative p-2.5 sm:p-4 pb-0">
        {/* පින්තූරයේ උස h-44 sm:h-48 දක්වා අඩු කළා */}
        <div className="relative h-36 sm:h-40 md:h-46 w-full bg-zinc-50 rounded-lg sm:rounded-xl overflow-hidden">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-zinc-300">
              <span className="text-[10px] sm:text-xs font-medium">
                No Image
              </span>
            </div>
          )}

          {/* Hover shimmer */}
          <div className="absolute inset-0 bg-white/0 group-hover/card:bg-white/[0.05] transition-colors duration-500" />
        </div>

        {/* Discount Badge - ප්‍රමාණය තරමක් කුඩා කළා */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 bg-white text-orange-500 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm border border-orange-100">
            {discount}% OFF
          </div>
        )}

        {/* Out of stock overlay label */}
        {!inStock && (
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 bg-zinc-100 text-zinc-500 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-zinc-200">
            Sold Out
          </div>
        )}
      </div>

      {/* Product Info - Padding අඩු කළා (p-4 pt-3) */}
      <div className="p-2.5 sm:p-4 pt-2 sm:pt-3 flex flex-col gap-1.5 sm:gap-2">
        {/* Title & Description */}
        <div>
          <h2 className="text-[12px] sm:text-[14px] font-semibold text-zinc-800 leading-snug line-clamp-1 group-hover/card:text-zinc-900 transition-colors duration-300">
            {product.name}
          </h2>
          <p className="text-[11px] sm:text-[12px] text-zinc-400 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed min-h-[28px] sm:min-h-[32px]">
            {product.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-zinc-100 my-0.5" />

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          {/* Price අකුරු text-base කළා */}
          <span className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.labelledPrice !== product.price && (
            <span className="text-[10px] sm:text-[11px] text-zinc-400 line-through font-medium">
              Rs. {product.labelledPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
