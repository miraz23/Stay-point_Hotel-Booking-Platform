import React from 'react';

const Banner = () => {
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block font-bold mb-2 text-gray-600 text-md">Location</label>
              <input type="text" placeholder="Cox's Bazar" className="w-full border border-gray-300 rounded-lg p-3 text-md"/>
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Check-in</label>
              <input type="date" className="border border-gray-300 rounded-lg p-3 text-md"/>
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Check-out</label>
              <input type="date" className="border border-gray-300 rounded-lg p-3 text-md" />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600 text-md">Guests</label>
              <select className="border border-gray-300 rounded-lg p-3 text-md">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>4 Guests</option>
              </select>
            </div>
            <div className="mt-[30px]">
              <button className="px-8 py-3 text-white text-md font-semibold rounded-lg shadow-md bg-cyan-500 hover:opacity-90 transition cursor-pointer">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;