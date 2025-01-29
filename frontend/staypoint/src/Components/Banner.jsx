import React from "react";

const Banner = () => {
  return (
    <div className="relative text-center py-20">

      <video className="absolute top-0 left-0 w-full h-full object-cover" src="banner4.mp4" autoPlay loop muted playsInline></video>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold uppercase text-white">Welcome to Stay Point</h2>
        <p className="mt-4 text-lg text-white">Find Your Hotel At Affortable Price</p>

        <div className="bg-white rounded-lg shadow-md mt-8 mx-auto p-6 w-full max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block font-bold mb-2 text-gray-600">Location</label>
              <input
                type="text"
                placeholder="Cox's Bazar, Bangladesh"
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600">Check-in</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600">Check-out</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-600">Guests</label>
              <select className="border border-gray-300 rounded-lg p-3">
                <option>1 Room</option>
                <option>2 Rooms</option>
                <option>3 Rooms</option>
              </select>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
