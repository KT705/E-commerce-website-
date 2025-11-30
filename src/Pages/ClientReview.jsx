import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

 function ClientReviews() {
  const reviews = [
    {
      name: "James Okoro",
      role: "Business Owner",
      message:
        "Their service completely transformed my looks. Styles has never been better.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Johnson",
      role: "Digital Marketer",
      message:
        "I have never looked this good before. I've tried many brand, but none match this level of class, beauty and professionalism.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Lee",
      role: "Startup Founder",
      message:
        "Amazing experience! They understood exactly what i needed, the level of style and fashion, unbeatable  ",
      image: "https://randomuser.me/api/portraits/men/21.jpg",
    },
  ];

  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-zinc-950 py-20 px-6 text-white flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
        What Our Clients Say
      </h1>

      <div className="relative w-full max-w-3xl bg-zinc-900 p-10 rounded-2xl shadow-xl">
        {/* Slide Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src={reviews[index].image}
            alt={reviews[index].name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
          />
          <p className="text-lg text-gray-300 italic">“{reviews[index].message}”</p>
          <h3 className="text-xl font-semibold">{reviews[index].name}</h3>
          <p className="text-blue-400">{reviews[index].role}</p>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-800 p-3 rounded-full hover:bg-zinc-700"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 p-3 rounded-full hover:bg-zinc-700"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Slider Indicators */}
      <div className="flex mt-6 space-x-3">
        {reviews.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-blue-500 scale-125" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
export default ClientReviews;
