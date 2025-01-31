import React from "react";

const Header = () => {
  return (
    <header className="bg-[#fff] font-medium shadow-md">
      <div className="flex items-center justify-between p-5">

        <div className="flex items-center">
          <h1 className="text-4xl line-clamp-2 ml-2 cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
            STAY POINT
          </h1>
        </div>

        <nav className="flex items-center space-x-2">
          <ul className="flex text-xl items-center space-x-7">
            <li className="font-semibold uppercase text-[#333] hover:text-[#000] cursor-pointer">Hotels</li>
            <li className="font-semibold uppercase text-[#333] hover:text-[#000] cursor-pointer">Bookings</li>
          </ul>
        </nav>

        <div className="flex items-center space-x-2">
            <button className="bg-gradient-to-r from-cyan-800 to-cyan-500 cursor-pointer text-white transition-all duration-500 ease-in-out hover:opacity-90 px-6 py-3 rounded-lg uppercase">
              Login
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
