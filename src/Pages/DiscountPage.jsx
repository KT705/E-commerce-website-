import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function DiscountPromo() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 md:px-20 py-20 text-white text-center overflow-hidden">
      {/* Left Section */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-2xl space-y-6 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight text-red-500"
        >
          50% OFF
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-3xl text-black md:text-4xl font-semibold"
        >
          Your First 10 Purchases
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-gray-950 text-center text-lg md:text-xl "
        >
          Shop smarter today! Enjoy massive discounts on your first ten items. Hurry limited time offer.
        </motion.p>

        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          onClick={() => navigate('/products')}
          className="px-8 py-3 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-xl shadow-xl text-lg font-semibold transition-all"
        >
          Start Shopping
        </motion.button>
      </motion.div>

      {/* Right Section Removed — No Image */}

      {/* Floating Animation Elements */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
        className="absolute top-10 right-10 w-16 h-16 bg-blue-600 rounded-full blur-xl opacity-40"
      />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
        className="absolute bottom-20 left-16 w-24 h-24 bg-purple-600 rounded-full blur-xl opacity-30"
      />
    </div>
  );
}

export default DiscountPromo;