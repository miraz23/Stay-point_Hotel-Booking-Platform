import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listHotels } from '../actions/hotelActions';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import Loader from './Loader';
import Message from './Message';
import { Link } from 'react-router-dom';


const Home = () => {
  const dispatch = useDispatch();
  const hotelsList = useSelector(state => state.hotelsList);
  const { loading, error, hotels } = hotelsList;

  useEffect(() => {
      dispatch(listHotels());
  }, [dispatch]);

  const featuredHotels = hotels ? hotels.filter(hotel => hotel.rating >= 4.5) : [];

  return (
    <>
      {/*---------------- Banner ----------------*/}
      <div className="relative h-[80vh] flex flex-col justify-center items-center">
        <video className="absolute top-0 left-0 w-full h-full object-cover" src="banner4.mp4" autoPlay loop muted playsInline></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        <div className="relative text-center z-10">
          <h2 className="text-3xl font-bold uppercase text-white">Welcome to <span className="text-cyan-500">Stay Point</span></h2>
          <p className="mt-4 text-sm text-white">Find Your Hotel At Affortable Price</p>

          <div className="bg-white rounded-lg shadow-md mt-8 mx-auto p-5 w-full max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block font-bold mb-2 text-gray-600 text-sm">Location</label>
                <input
                  type="text"
                  placeholder="Cox's Bazar, Bangladesh"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-600 text-sm">Check-in</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-600 text-sm">Check-out</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg p-2  text-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-gray-600 text-sm">Guests</label>
                <select className="border border-gray-300 rounded-lg p-2 text-sm">
                  <option>1 Room</option>
                  <option>2 Rooms</option>
                  <option>3 Rooms</option>
                </select>
              </div>
              <div className="mt-[30px]">
              <button className="bg-gradient-to-r from-cyan-800 to-cyan-500 cursor-pointer text-white text-sm transition-all duration-500 ease-in-out hover:opacity-90 px-6 py-2 rounded-lg font-bold">
                Search
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*---------------- Featured Hotels ----------------*/}
      <div className="text-center mt-10 mb-6 mx-10">
        <h1 className="text-4xl font-bold text-gray-800 p-2">Featured <span className='text-cyan-600'>Hotels</span></h1>
        <p className="text-lg my-1 text-gray-600">Stay at the best-rated hotels for an unforgettable experience.</p>
        <div className="w-full flex flex-wrap gap-4 mt-10">
          {loading ? (
              <Loader />
          ) : error ? (
              <Message variant='danger'>{error}</Message>
          ) : featuredHotels.length === 0 ? (
              <p className="text-lg text-gray-600">No featured hotels available.</p>
          ) : (
              featuredHotels.map((hotel) => (
                  <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-12px)] flex flex-col border-2 border-[#fff] rounded-xl p-4 bg-white shadow-2xl" key={hotel.id}>
                      <div className="flex flex-col justify-center items-center mb-4">
                          <div className="aspect-[3/2] flex items-center justify-center rounded-xl">
                              <img className="w-full h-full object-cover rounded-xl" src={`http://127.0.0.1:8000${hotel.image}`} alt="Hotel Logo" />
                          </div>
                          <div className="text-center pt-3">
                              <h1 className="text-xl font-bold text-gray-800">{hotel.name}</h1>
                          </div>
                      </div>
                      <div className="flex justify-between mb-5">
                          <div className="flex items-center">
                              <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                              <span className="text-gray-600">{hotel.location}</span>
                          </div>
                          <div className="flex items-center">
                              <StarIcon className="h-5 w-5 text-yellow-500 mr-2"/>
                              <span className="text-gray-600 font-semibold">{hotel.rating}</span>
                          </div>
                      </div>
                      <Link to={`/hotels/${hotel.id}`}>
                          <button className="w-full bg-gradient-to-r from-cyan-800 to-cyan-500 cursor-pointer text-white py-2 rounded-lg font-semibold 
                              transition-all duration-500 ease-in-out 
                              hover:opacity-90">
                              View Details
                          </button>
                      </Link>
                  </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
