import React, { useState } from 'react';

function AboutUs() {
  const [activeSection, setActiveSection] = useState('about');

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>About <span className='text-cyan-600'>Stay Point</span></h1>
            <p className='p-6'>
              Stay Point is a leading provider of high-quality accommodation services. Our mission is to offer comfortable and affordable stays for travelers around the world. We pride ourselves on our exceptional customer service and our commitment to sustainability.
              <br></br>Our accommodations range from budget-friendly options to luxury stays, ensuring that every traveler finds a place that suits their needs. With a focus on convenience, cleanliness, and modern amenities, we strive to create a home-away-from-home experience. Whether you're traveling for business or leisure, Stay Point is dedicated to making your stay memorable and enjoyable.
              <br></br>At Stay Point, we go beyond just providing a place to stay—we create experiences that leave a lasting impression. Our carefully selected locations, thoughtful amenities, and attention to detail ensure that every guest enjoys a seamless and relaxing stay. Whether you're exploring a new city or seeking a peaceful retreat, Stay Point is your trusted home away from home.
            </p>
          </div>
        );
      case 'legal':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>Legal</h1>
            <p className='p-6'>
              Our legal policies ensure that we operate within the bounds of the law and maintain transparency with our customers. We are committed to protecting your privacy and ensuring the security of your data.
            </p>
          </div>
        );
      case 'digitalServicesAct':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>Digital Services Act</h1>
            <p className='p-6'>
              The Digital Services Act aims to create a safer digital space where the fundamental rights of users are protected and to establish a level playing field for businesses.
            </p>
          </div>
        );
      case 'digitalMarketsAct':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>Digital Markets Act</h1>
            <p className='p-6'>
              The Digital Markets Act aims to ensure fair and open digital markets by preventing large online platforms from abusing their market power.
            </p>
          </div>
        );
      case 'termsConditions':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>Terms & Conditions</h1>
            <p className='p-6'>
              Our terms and conditions outline the rules and regulations for using our services. By accessing our website, you agree to comply with these terms.
            </p>
          </div>
        );
      case 'howWeWork':
        return (
          <div>
            <h1 className='text-4xl text-gray-800 py-2 px-6'>How We Work</h1>
            <p className='p-6'>
              At Stay Point, we work tirelessly to provide the best possible experience for our guests. From the moment you book with us, our team is dedicated to ensuring your stay is comfortable and enjoyable. We continuously strive to improve our services based on customer feedback.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex gap-10 my-30 mx-10'>
      <div className='w-1/6'>
        <ul>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'about' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('about')}>
            About Us
          </li>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'legal' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('legal')}>
            Legal
          </li>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'digitalServicesAct' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('digitalServicesAct')}>
            Digital Services Act
          </li>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'digitalMarketsAct' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('digitalMarketsAct')}>
            Digital Markets Act
          </li>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'termsConditions' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('termsConditions')}>
            Terms & Conditions
          </li>
          <li
            className={`text-[17px] p-3 cursor-pointer ${activeSection === 'howWeWork' ? 'text-cyan-600 bg-[#f6f6f6]' : 'hover:bg-[#f6f6f6]'}`}
            onClick={() => setActiveSection('howWeWork')}>
            How We Work
          </li>
        </ul>
      </div>
      <div className='w-5/6'>
        {renderContent()}
      </div>
    </div>
  );
}

export default AboutUs;