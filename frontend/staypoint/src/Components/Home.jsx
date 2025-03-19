import React from 'react';
import Banner from './Banner';
import FeaturedHotels from './FeaturedHotels';
import Faq from './Faq';

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
