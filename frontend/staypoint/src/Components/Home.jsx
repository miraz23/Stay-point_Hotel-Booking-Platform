import React from "react";

const Banner = () => {
  return (
    <>
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
    </>
  );
};

export default Banner;
