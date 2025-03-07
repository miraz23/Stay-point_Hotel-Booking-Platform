import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-center">
      <div className="absolute top-0 w-[94%] bg-[#fff] font-medium shadow-md rounded-2xl my-2 z-50">
        <div className="flex items-center justify-between py-3 px-5">

          <div className="flex items-center">
            <h1 className="text-[27px] line-clamp-2 ml-2 cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
              STAY POINT
            </h1>
          </div>

          <nav className="flex items-center space-x-2">
            <ul className="flex text-[16px] items-center space-x-7">
              <Link to="/"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Home</li></Link>
              <Link to="/hotels/"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Hotels</li></Link>
              <Link to="/my-bookings"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Bookings</li></Link>
              <Link to="/about-us"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">About Us</li></Link>
              <Link to="/contact-us"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Contact Us</li></Link>
            </ul>
          </nav>

          <div className="flex items-center space-x-2">
            <Link to="/auth/login">
              <button className="bg-gradient-to-r from-cyan-800 to-cyan-500 cursor-pointer text-white text-sm transition-all duration-500 ease-in-out hover:opacity-90 px-3 py-2 rounded-lg uppercase">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
