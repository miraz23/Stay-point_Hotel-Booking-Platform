import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Headers from './components/Header';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Hotel from './components/Hotel';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signin from './pages/Signin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserProfile from './pages/UserProfile';
import HotelDashboard from './pages/HotelDashboard';
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/auth/login" || location.pathname === "/auth/signin" || location.pathname === "/auth/forgot-password" || location.pathname.includes("/auth/reset-password");

  return (
    <div>
      {!hideHeaderFooter && <Headers />}
      <Toaster />
      {children}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<Hotel />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signin" element={<Signin />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/auth/profile" element={<UserProfile />} />
          <Route path="/hotel-dashboard/:id" element={<HotelDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;