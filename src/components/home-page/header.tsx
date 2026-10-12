import { useIsMobile } from "@/hooks/use-mobile";
import { PATHS } from "@/paths";
import { startTransition, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

const Header = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (window && window.innerWidth) {
      setWidth(window.innerWidth);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <header
      className={`py-4 px-5 z-50 h-[15vh] ${isMobile ? "fixed shadow-none bg-transparent" : "bg-white shadow-sm"}`}
    >
      <div className="max-w-[90%] mx-auto flex justify-between items-center">
        <div
          className="flex items-center"
          onClick={() =>
            startTransition(() => startTransition(() => navigate(PATHS.root)))
          }
        >
          <img
            src="/lovable-uploads/34c06baa-59ac-46fe-b9e2-75b5a180a80d.png"
            alt="City Beach Australia"
            className={`h-10 md:h-12 ${isMobile ? "opacity-50" : ""}`}
          />
        </div>
        {!isMobile && (
          <>
            <div className="w-2/4 relative">
              {typeof width === "number" && width > 100 && (
                <input
                  className="outline-none bg-[#edf1f2] rounded-full p-4 py-3 pr-14 w-full"
                  name="search-products"
                  placeholder="Search 200+ brands and thousands of products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              {search && (
                <div
                  className="absolute top-[40%] right-[5%] cursor-pointer"
                  onClick={() => setSearch("")}
                >
                  <ReactSVG src="/home/close-icon.svg" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-800">
              {/* Currency Dropdown */}
              <div className="flex items-center font-normal py-2 pt-1 gap-1 border-b border-t border-gray-300 pb-0.5">
                <span>$</span>
                <span>AUD</span>
              </div>

              {/* Rewards Button */}
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-full cursor-pointer">
                <ReactSVG src="/home/desktop/user_reward.svg" className="" />
                <span className="font-semibold tracking-wide text-gray-700">
                  REWARDS
                </span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Icons */}
              <a href="#" className="hover:opacity-70">
                <ReactSVG src="/home/desktop/heart.svg" className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-70">
                <ReactSVG
                  src="/home/desktop/location.svg"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-70">
                <ReactSVG
                  src="/home/desktop/cart_icon.svg"
                  className="w-5 h-5"
                />
              </a>
            </div>
          </>
        )}
      </div>
      {!isMobile && (
        <div className="bg-white w-full relative z-10">
          {typeof width === "number" && width <= 100 && (
            <input
              className="mt-4 outline-none bg-[#edf1f2] rounded-full p-4 py-3 pr-14 w-full"
              name="search-products"
              placeholder="Search 200+ brands and thousands of products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          <nav className="flex items-center justify-center gap-6 py-4 pb-0 text-sm font-semibold uppercase">
            <Link to="#" className="text-black hover:text-gray-700">
              New In
            </Link>
            <Link to="#" className="text-black hover:text-gray-700">
              Womens
            </Link>
            <Link to="#" className="text-black hover:text-gray-700">
              Mens
            </Link>
            <Link to="#" className="text-black hover:text-gray-700">
              Kids
            </Link>
            <Link to="#" className="text-black hover:text-gray-700">
              Trending
            </Link>
            <Link to="#" className="text-red-500 hover:text-red-600">
              Sale
            </Link>
            <Link to="#" className="text-[#CC5500] hover:text-orange-600">
              Recalls
            </Link>
            <button className="bg-[#F8E300] text-black px-6 font-light py-1 rounded-full cursor-pointer">
              grace & stella
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
