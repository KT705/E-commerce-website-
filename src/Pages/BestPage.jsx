import image from "../assets/bg-4.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

function BestPage() {
    const navigate = useNavigate();
    useEffect(() => {
        Aos.refresh();
        }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-20 items-center justify-between px-8 md:px-20 bg-white">
      
      <div className="w-full md:w-1/2 space-y-6 md:pr-10 text-center md:text-left" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="1200">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Be among the first to glow with our best collections
        </h1>
        <p className="text-lg md:text-xl text-gray-950">
          A place to bring out your inner beast and beauty, where fashion lives
        </p>
        <button
        onClick={() => navigate('/products')} 
        className="px-6 py-3 bg-black text-white rounded-xl text-lg font-semibold cursor-pointer shadow-md hover:bg-blue-950  transform transition-transform duration-300 ease-in-out hover:scale-105">
          Get Started
        </button>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center" data-aos="slide-left" data-aos-duration="1200"   
       data-aos-delay="1200">
        <img
          src={image}
          alt="Landing Visual"
          className="w-full max-w-md rounded-2xl  object-cover"
        />
      </div>
    </div>
  );
}

export default BestPage;
