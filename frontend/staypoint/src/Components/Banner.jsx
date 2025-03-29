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
    <div className="relative h-[100vh] flex flex-col justify-center items-center">
      <video className="absolute top-0 left-0 w-full h-full object-cover" src="banner4.mp4" autoPlay loop muted playsInline></video>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <div className="relative text-center z-10">
        <h2 className="text-4xl font-bold uppercase text-white">
          Welcome to <span className="text-cyan-500">Stay Point</span>
        </h2>
        <p className="mt-4 text-xl text-white">Find Your Hotel At Affordable Price</p>

        <div className="bg-white rounded-lg shadow-md mt-8 mx-auto p-6 w-full max-w-4xl">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block font-bold mb-2 text-gray-600 text-md">Location</label>
              <input 
                type="text" 
                name="location"
                value={searchData.location}
                onChange={handleInputChange}
                placeholder="Cox's Bazar" 
                className="w-full border border-gray-300 rounded-lg p-3 text-md"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Check-in</label>
              <input 
                type="date" 
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg p-3 text-md"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Check-out</label>
              <input 
                type="date" 
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg p-3 text-md" 
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Guests</label>
              <select 
                name="guests"
                value={searchData.guests}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 text-md"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <div className="mt-[30px]">
              <button 
                type="submit"
                className="px-8 py-3 text-white text-md font-semibold rounded-lg shadow-md bg-cyan-500 hover:opacity-90 transition cursor-pointer"
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