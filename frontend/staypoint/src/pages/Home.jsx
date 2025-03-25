import React from 'react';
import Banner from '../components/Banner';
import FeaturedHotels from '../components/FeaturedHotels';
import Faq from '../components/Faq';

const Home = () => {
  return (
    <>
      {/*---------------- Banner ----------------*/}
      <Banner />

      {/*---------------- Featured Hotels ----------------*/}
      <FeaturedHotels />

      {/*---------------- FAQ Section ----------------*/}
      <Faq />
    </>
  );
};

export default Home;
