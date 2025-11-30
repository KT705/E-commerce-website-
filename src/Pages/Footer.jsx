import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

 function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-gray-300 py-12 px-6 md:px-20 pt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">KT</h2>
          <p className="text-gray-400 leading-relaxed">
            Premium Collections that makes your Ex regret leaving you.
          </p>
        </div>

        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <Link to="/" className="p-2 text-white  hover:text-gray-300
                 transition-all cursor-pointer">Home</Link>

            <Link to="/products" className="p-2 text-white  hover:text-gray-300
                transition-all cursor-pointer">Products</Link>

            <Link to="/contact" className="p-2 text-white  hover:text-gray-300
                transition-all cursor-pointer">Contact</Link>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Stay Connected</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Mail size={20} /> sterlumun963@gmail.com
            </p>
          </div>

          <div className="flex gap-5 mt-4">
            <Facebook className="cursor-pointer hover:text-white transition" />
            <Instagram className="cursor-pointer hover:text-white transition" />
            <Twitter className="cursor-pointer hover:text-white transition" />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-sm mt-12 border-t border-zinc-700 pt-6">
        © {new Date().getFullYear()} KT. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;