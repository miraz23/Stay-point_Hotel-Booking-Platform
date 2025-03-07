import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Headers from './components/Header';
import Home from './components/Home';
import Hotels from './components/Hotels';
import Hotel from './components/Hotel';
import Bookings from './components/Bookings';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Login from './components/Login'
import Signin from './components/Signin'
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <div>
        <Headers />
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<Hotel />} />
          <Route path="/my-bookings" element={<Bookings />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signin" element={<Signin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;