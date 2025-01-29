import React from "react";

const Header = () => {
  return (
    <header className="bg-blue-900 text-white">
      <div className="flex items-center justify-between p-4">

        <div className="flex items-center">
          <img src="logo.png" className="h-10 w-8" />
          <h1 className="text-xl font-bold ml-2">STAY POINT</h1>
        </div>

        <nav className="flex items-center space-x-2">
          <ul className="flex space-x-4">
            <li>Hotels</li>
            <li>SignIn</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
