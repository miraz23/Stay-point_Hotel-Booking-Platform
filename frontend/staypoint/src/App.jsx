import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Headers from './Components/Header';
import Banner from './Components/Banner';
import Hotels from './Components/Hotels';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <div>
        <Headers />
        <Banner />
        <Hotels />
        <Footer />
      </div>
    </Router>
  );
};

export default App;