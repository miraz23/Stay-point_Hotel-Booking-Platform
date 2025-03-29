import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IconUser, IconLogout2, IconUserCircle, IconMenu2, IconX } from "@tabler/icons-react";
import { logout } from "../actions/userActions";
import { USER_LOGIN_SUCCESS } from "../constants/userConstants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const isAuthenticated = !!userInfo;
  const userName = userInfo?.name || "User";

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfoFromStorage) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfoFromStorage });
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-center">
      <div className="absolute top-0 w-[95%] bg-[#fff] font-medium shadow-md rounded-2xl my-5 z-50">
        <div className="flex items-center justify-between py-3 px-5">
          <div className="flex items-center">
            <Link to="/">  
              <h1 className="text-[25px] cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text mt-2" style={{ fontFamily: "Gochi Hand, cursive" }}>
                STAY POINT
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <ul className="flex text-[16px] items-center space-x-7">
              <Link to="/"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Home</li></Link>
              <Link to="/hotels/"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Hotels</li></Link>
              <Link to="/about-us"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">About Us</li></Link>
              <Link to="/contact-us"><li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer">Contact Us</li></Link>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                <button onClick={handleLogout} className="cursor-pointer text-gray-700 hover:text-gray-900 transition px-2">
                  <IconLogout2 />
                </button>
                <Link to="/auth/profile">
                  <button className="cursor-pointer flex hover:text-gray-900 text-gray-700">
                    <IconUserCircle />
                    <span className="px-1"> {userName} </span>
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/auth/login">
                <IconUser className="cursor-pointer text-gray-700 hover:text-gray-900" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="py-2">
              <ul className="flex flex-col space-y-2 px-5">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer py-2">Home</li>
                </Link>
                <Link to="/hotels/" onClick={() => setIsMenuOpen(false)}>
                  <li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer py-2">Hotels</li>
                </Link>
                <Link to="/about-us" onClick={() => setIsMenuOpen(false)}>
                  <li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer py-2">About Us</li>
                </Link>
                <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                  <li className="font-semibold text-[#333] hover:text-[#000] cursor-pointer py-2">Contact Us</li>
                </Link>
              </ul>
            </nav>
            <div className="px-5 py-2 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <button onClick={handleLogout} className="cursor-pointer text-gray-700 hover:text-gray-900 transition py-2 flex items-center">
                    <IconLogout2 className="mr-2" />
                    Logout
                  </button>
                  <Link to="/auth/profile" onClick={() => setIsMenuOpen(false)}>
                    <button className="cursor-pointer flex hover:text-gray-900 text-gray-700 py-2">
                      <IconUserCircle className="mr-2" />
                      {userName}
                    </button>
                  </Link>
                </div>
              ) : (
                <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="cursor-pointer flex hover:text-gray-900 text-gray-700 py-2">
                    <IconUser className="mr-2" />
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;