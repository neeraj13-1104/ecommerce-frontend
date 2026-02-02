import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* 🔹 BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">MyStore</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            India’s trusted online shopping platform for quality products,
            fast delivery and secure payments.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <IconWrap><FaFacebookF /></IconWrap>
            <IconWrap><FaInstagram /></IconWrap>
            <IconWrap><FaTwitter /></IconWrap>
            <IconWrap><FaYoutube /></IconWrap>
          </div>
        </div>

        {/* 🔹 QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <FooterLink to="/products">Products</FooterLink>
            <FooterLink to="/cart">Cart</FooterLink>
            <FooterLink to="/orders">Orders</FooterLink>
            <FooterLink to="/wishlist">Wishlist</FooterLink>
            <FooterLink to="/offers">Offers</FooterLink>
          </ul>
        </div>

        {/* 🔹 CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Smartphones</li>
            <li>Laptops</li>
            <li>Fashion</li>
            <li>Furniture</li>
            <li>Groceries</li>
          </ul>
        </div>

        {/* 🔹 CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500" />
              India
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-purple-500" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-purple-500" />
              support@mystore.com
            </li>
          </ul>
        </div>
      </div>

      {/* 🔻 BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
};

/* 🔹 Small reusable components */

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-purple-400 transition duration-200"
    >
      {children}
    </Link>
  </li>
);

const IconWrap = ({ children }) => (
  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-purple-600 text-white cursor-pointer transition">
    {children}
  </div>
);

export default Footer;
