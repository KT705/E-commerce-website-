import image from "../assets/bg-2.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";


function LandingPage() {
    const navigate = useNavigate();
    useEffect(() => {
    Aos.refresh();
    }, []);
    return (
        <div
            className="w-full min-h-screen bg-cover bg-right md:bg-center relative"
            style={{ backgroundImage: `url(${image})` }}
        >
            {/* DARK GRADIENT OVERLAY FOR READABILITY */}
            <div className="absolute inset-0 bg-black/40 md:bg-transparent"></div>

            {/* CONTENT WRAPPER */}
            <div className="relative flex items-center min-h-screen pb-4 px-6 md:px-16 pt-10" >

                <div className="
                    flex flex-col 
                    text-center md:text-left 
                    w-full md:w-1/2 
                    max-w-xl
                ">
                    <h1 className="
                        text-white font-bold
                        text-3xl sm:text-5xl md:text-6xl md:text-black
                        leading-tight drop-shadow-md text-shadow-lg/30
                    "  data-aos="fade-up">
                        Make the best of who you are with Kt's collections
                    </h1>

                    <p className="mt-4 text-lg text-black font-bold" data-aos="fade-up" >
                        Shop from our amazing deals on fashion, electronics, <br /> and accessories.
                    </p>

                   <button 
                   onClick={() => navigate('/products')}
                   className="mt-5 px-3 py-2 bg-black text-white rounded-md text-lg cursor-pointer shadow-lg hover:bg-gray-900 md:w-1/2  transform transition-transform duration-300 ease-in hover:scale-105"
                   data-aos="slide-right" >
                        Shop Now
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
