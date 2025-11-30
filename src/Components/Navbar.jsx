import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContex.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems, userAvatar, userName, logOut, isAuthReady, isLoggedIn } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileInitial = userAvatar || (userName ? userName.charAt(0).toUpperCase() : "?");

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed in Navbar:", error);
    }
  };

  const AuthActions = ({ isMobile = false }) => (
    <div className={`flex items-center gap-6 ${isMobile ? "flex-col items-start w-full" : "flex-row"}`}>
      {isLoggedIn && !isMobile && (
        <Link
          to="/profile"
          className={`flex items-center justify-center w-14 h-8 rounded-full bg-gray-500 text-white font-bold text-sm hover:ring-2 ring-indigo-300 transition-all ${
            isMobile ? "order-first mb-4" : ""
          }`}
        >
          {profileInitial}
        </Link>
      )}

      {isLoggedIn && isAuthReady ? (
        <button
          onClick={handleLogout}
          className={`p-2 font-semibold text-black bg-white hover:bg-gray-400 rounded-full transition-all cursor-pointer w-full text-center ${
            isMobile ? "py-2 px-3 rounded-none" : "p-2 px-2"
          }`}
        >
          Logout
        </button>
      ) : (
        <Link
          to="/auth"
          onClick={() => setIsMenuOpen(false)} // Close mobile menu when navigating
          className={`p-2 font-semibold text-black bg-white hover:bg-gray-200 rounded-full transition-all cursor-pointer w-full text-center ${
            isMobile ? "py-2 px-3 rounded-none" : ""
          }`}
        >
          Sign In
        </Link>
      )}
    </div>
  );

  return (
    <header className="flex justify-between items-center text-black py-3 px-8 md:px-32 bg-black drop-shadow-2xl fixed w-full z-50">
      <Link to="/">
        <h2 className="h-7 text-white pb-2 text-2xl font-bold px-3 rounded-lg text-center hover:scale-105 transition-all">
          KT
        </h2>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
        <Link to="/" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Home
        </Link>
        <Link to="/products" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Products
        </Link>
        <Link to="/contact" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Contact
        </Link>

        <div className="h-10 flex justify-center items-center relative">
          <Link to="/cart" className="p-3 text-white text-xl rounded-md transition-all cursor-pointer">
            <i className="fa-solid fa-cart-arrow-down"></i>
          </Link>
          {totalItems > 0 && (
            <span className="absolute top-0 left-1/2 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
              {totalItems}
            </span>
          )}
        </div>

        <AuthActions />
      </ul>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center space-x-4 xl:hidden">
        {isLoggedIn && (
          <Link
            to="/profile"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm hover:ring-2 ring-indigo-300 transition-all shrink-0"
          >
            {profileInitial}
          </Link>
        )}

        <div className="h-10 flex justify-center items-center relative">
          {/* Hamburger / Close Icon */}
          <i
            className={`fa-solid text-white text-2xl cursor-pointer transform transition-transform duration-300 ${
              isMenuOpen ? "fa-xmark rotate-90" : "fa-bars"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          ></i>

          {totalItems > 0 && (
            <span className="absolute top-0 left-1/2 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute xl:hidden top-12 left-0 w-full bg-black flex flex-col items-center gap-6 font-semibold text-lg transform transition-transform duration-300 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <Link to="/" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Home
        </Link>
        <Link to="/products" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Products
        </Link>
        <Link to="/contact" className="p-2 text-white hover:bg-white hover:text-black rounded-full transition-all cursor-pointer">
          Contact
        </Link>

        <div className="h-10 flex justify-center items-center relative">
          <Link to="/cart" className="p-3 text-white text-xl rounded-md transition-all cursor-pointer">
            <i className="fa-solid fa-cart-arrow-down"></i>
          </Link>
          {totalItems > 0 && (
            <span className="absolute top-0 left-1/2 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center">
              {totalItems}
            </span>
          )}
        </div>

        <div className="w-full pt-4 border-gray-100 flex flex-col items-center gap-4">
          <AuthActions isMobile={true} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
