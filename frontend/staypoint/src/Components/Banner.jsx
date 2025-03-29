import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Banner = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.location) {
      toast.error('Please enter a location');
      return;
    }

    if (!searchData.checkIn || !searchData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(searchData.checkIn) >= new Date(searchData.checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (new Date(searchData.checkIn) < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/hotels/search/', {
        params: searchData
      });

      if (response.data.length === 0) {
        toast.error('No hotels found matching your criteria');
        return;
      }

      // Store search results in localStorage for the Hotels page to use
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      localStorage.setItem('searchParams', JSON.stringify(searchData));
      
      // Navigate to hotels page
      navigate('/hotels');
    } catch (error) {
      toast.error('Error searching for hotels');
    }
  };

  return (
    <div className="relative min-h-[100vh] flex flex-col justify-center items-center px-4 md:px-0">
      <video className="absolute top-0 left-0 w-full h-full object-cover" src="banner4.mp4" autoPlay loop muted playsInline></video>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <div className="relative text-center z-10 w-full">
        <h2 className="text-2xl md:text-4xl font-bold uppercase text-white px-4">
          Welcome to <span className="text-cyan-500">Stay Point</span>
        </h2>
        <p className="mt-2 md:mt-4 text-lg md:text-xl text-white px-4">
          Find Your Hotel At Affordable Price
        </p>

        <div className="bg-white rounded-lg shadow-md mt-4 md:mt-8 mx-auto p-4 md:p-6 w-full max-w-4xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
            <div className="w-full md:flex-1">
              <label className="block font-bold mb-2 text-gray-600 text-sm md:text-md">Location</label>
              <input 
                type="text" 
                name="location"
                value={searchData.location}
                onChange={handleInputChange}
                placeholder="Cox's Bazar" 
                className="w-full border border-gray-300 rounded-lg p-2 md:p-3 text-sm md:text-md"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-bold mb-2 text-gray-600 text-sm md:text-md">Check-in</label>
              <input 
                type="date" 
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg p-2 md:p-3 text-sm md:text-md"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-bold mb-2 text-gray-600 text-sm md:text-md">Check-out</label>
              <input 
                type="date" 
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg p-2 md:p-3 text-sm md:text-md" 
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-bold mb-2 text-gray-600 text-sm md:text-md">Guests</label>
              <select 
                name="guests"
                value={searchData.guests}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 md:p-3 text-sm md:text-md"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-[30px]">
              <button 
                type="submit"
                className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-white text-sm md:text-md font-semibold rounded-lg shadow-md bg-cyan-500 hover:opacity-90 transition cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;