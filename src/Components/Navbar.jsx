import { useState } from "react";
import ReactLogo from "../assets/react.svg"
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContex.jsx";

function Navbar(){
    const navigate = useNavigate();

    const { totalItems, userId, userName, logOut, isAuthReady, isLoggedIn } = useCart();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const profileInitial = userName
        ? userName.charAt(0).toUpperCase()
        : null;   

    const handleLogout = async () => {
        try{
            await logOut();
            navigate('/auth');
        } catch(error){
            console.error("Logout failed in Navbar:", error);
        }
    };

     const AuthActions = ({ isMobile = false }) => (
        <div className={`flex items-center gap-6 ${isMobile ? 'flex-col items-start w-full' : 'flex-row'}`}>
            
            {isLoggedIn && !isMobile && (
                <Link
                    to="/profile"
                    className={`flex items-center justify-center w-14 h-8 rounded-full bg-gray-500 text-white font-bold text-sm hover:ring-2 ring-indigo-300 transition-all ${isMobile ? 'order-first mb-4' : ''}`}
                >
                    {profileInitial}
                </Link>
            )}
            
           
            {isLoggedIn && isAuthReady ? (
                
                <button
                    onClick={handleLogout}
                    className={`p-2 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full transition-all cursor-pointer w-full text-center ${isMobile ? 'py-2 px-3 rounded-none' : 'p-2 px-2'}`}
                >
                    Logout
                </button>
            ) : (
                
                <Link 
                    to="/auth" 
                    onClick={() => setIsMenuOpen(false)} // Close mobile menu when navigating
                    className={`p-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all cursor-pointer w-full text-center ${isMobile ? 'py-2 px-3 rounded-none' : ''}`}
                >
                    Sign In
                </Link>
            )}
        </div>
    );

    
    const logoPlaceholder = "https://placehold.co/100x28/4f46e5/ffffff?text=E-Shop";

    return(
        <header className="flex justify-between items-center text-black
        py-3 px-8 md:px-32 bg-white drop-shadow-md fixed mb-20 w-full z-50">
            <Link to="/">
                <img src={logoPlaceholder} alt="Logo" className="h-7 
                hover:scale-105 transition-all"/>
            </Link>   

            <ul className="hidden xl:flex items-center gap-12
            font-semibold text-base">
                <Link to="/" className="p-3 text-black hover:bg-sky-400 hover:text-white
                rounded-md transition-all cursor-pointer">Home</Link>

                <Link to="/products" className="p-3 text-black hover:bg-sky-400 hover:text-white
                rounded-md transition-all cursor-pointer">Products</Link>
    
                <Link className="p-3 text-black hover:bg-sky-400 hover:text-white
                rounded-md transition-all cursor-pointer">Contact</Link>

                <div className="h-10 flex justify-center items-center relative">
                    <Link to="/cart" className="p-3 text-black text-xl
                    rounded-md transition-all cursor-pointer"><i className="fa-solid fa-cart-arrow-down"></i></Link>
                    {totalItems > 0 && (
                    <span className="absolute top-0 left-1/2 bg-red-500 text-white
                    text-sm w-5 h-5 rounded-full flex justify-center items-center">{totalItems}</span>
                    )}
                </div>

                
                <AuthActions/>
            </ul>


            <div className=" flex items-center space-x-4 xl:hidden">

                

                {/* 2. Avatar Link (Always Visible on Mobile/Tablet if logged in) */}
                {isLoggedIn && (
                    <Link
                        to="/profile"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-bold text-sm hover:ring-2 ring-indigo-300 transition-all shrink-0"
                    >
                        {profileInitial}
                    </Link>
                )}

                <div className="h-10 flex justify-center items-center relative">
                    <i className="fa-solid fa-bars block text-2xl cursor-pointer xl:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                ></i>
                    {totalItems > 0 && (
                    <span className="absolute top-0 left-1/2 right-0 bg-red-500 text-white
                    text-xs w-5 h-5 rounded-full flex justify-center items-center">{totalItems}</span>
                    )}
                </div>
            </div>

            <div className={`absolute xl:hidden top-20
                 left-0 w-full bg-white flex flex-col items-center gap-6 font-semibold 
                 text-lg transform transition-transform ${isMenuOpen ? 
                "opacity-100" : "opacity-0 pointer-events-none"
                 }`} 
                 style={{transition: "transform 0.3s ease, opacity 0.3s ease"}}
                >
                <Link to="/" className="p-3 text-black hover:bg-sky-400 hover:text-white
                    rounded-md transition-all cursor-pointer">Home</Link>

                <Link to="/products" className="p-3 text-black hover:bg-sky-400 hover:text-white
                    rounded-md transition-all cursor-pointer">Products</Link>
    
                <Link className="p-3 text-black hover:bg-sky-400 hover:text-white
                    rounded-md transition-all cursor-pointer">Contact</Link>

                <div className="h-10 flex justify-center items-center relative">
                    <Link to="/cart" className="p-3 text-black text-xl
                    rounded-md transition-all cursor-pointer"><i className="fa-solid fa-cart-arrow-down"></i></Link>
                    {totalItems > 0 && (
                    <span className="absolute top-0 left-1/2 bg-red-500 text-white
                    text-sm w-5 h-5 rounded-full flex justify-center items-center">{totalItems}</span>
                    )}
                </div>

                

                <div className="w-full pt-4 border-t border-gray-100 flex flex-col items-center gap-4">
                    <AuthActions isMobile={true} />
                </div>
            </div>
        </header>
    );
}
export default Navbar;