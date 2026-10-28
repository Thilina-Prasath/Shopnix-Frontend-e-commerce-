import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (mobileOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileOpen]);

  const runSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMobileOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      {/* Desktop / tablet search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="search-bar hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8 items-center bg-white rounded-md overflow-hidden border border-gray-300 shadow-sm transition-all duration-300 focus-within:shadow-md"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in Shopnix..."
          className="w-full px-3 lg:px-4 py-2 text-gray-900 placeholder-gray-400 bg-transparent outline-none text-sm"
        />
        <button
          type="submit"
          className="search-btn px-4 lg:px-5 py-2.5 flex items-center justify-center text-white transition-all duration-300"
          aria-label="Search"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Mobile: compact icon that expands into a full search bar */}
      <button
        onClick={() => setMobileOpen(true)}
        className="search-btn md:hidden p-2 sm:p-2.5 rounded-xl text-white active:scale-90 transition-all duration-200"
        aria-label="Open search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Mobile search overlay */}
      <div
        className={`mobile-search-overlay md:hidden fixed inset-0 z-[70] transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/40"
          onClick={() => setMobileOpen(false)}
        />
        <form
          onSubmit={handleSearchSubmit}
          className={`mobile-search-panel absolute top-0 left-0 right-0 bg-white shadow-xl flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={mobileInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Shopnix..."
            className="flex-1 text-gray-700 placeholder-gray-400 bg-transparent outline-none text-sm min-w-0"
          />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
            aria-label="Close search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
