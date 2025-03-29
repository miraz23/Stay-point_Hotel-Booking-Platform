import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom'
import { IconCalendarCheck, IconUsers } from '@tabler/icons-react';

const Hotels = () => {
    const [hotels, setHotels] = useState([])
    const [searchParams, setSearchParams] = useState(null)

    useEffect(() => {
        // Check if there are search results from the Banner component
        const searchResults = localStorage.getItem('searchResults');
        const params = localStorage.getItem('searchParams');

        if (searchResults && params) {
            setHotels(JSON.parse(searchResults));
            setSearchParams(JSON.parse(params));
            // Clear the search data from localStorage
            localStorage.removeItem('searchResults');
            localStorage.removeItem('searchParams');
        } else {
            // If no search results, fetch all hotels
            async function fetchHotels() {
                const {data} = await axios.get('http://127.0.0.1:8000/api/hotels/');
                setHotels(data);
            }
            fetchHotels();
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="text-center my-30 mx-10">
            <h1 className="text-4xl font-bold text-gray-800 p-2">Our <span className='text-cyan-500'>Hotels</span></h1>
            {searchParams && (
                <div className="flex flex-wrap justify-center gap-4 mt-4 mb-6">
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-cyan-500 mr-2" />
                        <span className="text-gray-700">{searchParams.location}</span>
                    </div>
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                        <IconCalendarCheck className="h-5 w-5 text-cyan-500 mr-2" />
                        <span className="text-gray-700">
                            {new Date(searchParams.checkIn).toLocaleDateString()} - {new Date(searchParams.checkOut).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                        <IconUsers className="h-5 w-5 text-cyan-500 mr-2" />
                        <span className="text-gray-700">{searchParams.guests} Guest{searchParams.guests > 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
            <p className="text-lg my-1 text-gray-600">Explore hundreds of hotels opportunities with all the information you need.</p>
            
            <div className="w-full flex flex-wrap gap-4 mt-10">
                {hotels.length === 0 ? (
                    <div className="w-full text-center py-10">
                        <p className="text-xl text-gray-500">No hotels found matching your criteria.</p>
                    </div>
                ) : (
                    hotels.map((hotel) => (
                        <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-12px)] flex flex-col justify-between border-2 border-[#fff] rounded-xl p-4 bg-white shadow-2xl" key={hotel.id}>
                            <div className="flex flex-col justify-center items-center mb-4">
                                <div className="aspect-[3/2] flex items-center justify-center rounded-xl">
                                    {hotel.image ? (
                                        <img className="w-full h-full object-cover rounded-xl" src={`http://127.0.0.1:8000${hotel.image}`} alt="Hotel Logo" />
                                    ) : (
                                        <img className="w-full h-full object-cover rounded-xl" src="/default-hotel.jpg" alt="Hotel Logo" />
                                    )}
                                </div>
                                <div className="text-center pt-3">
                                    <h1 className="text-xl font-bold text-gray-800">{hotel.name}</h1>
                                </div>
                            </div>
                            <div className="flex justify-between mb-5">
                                <div className="flex items-center text-left">
                                    <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                                    <span className="text-gray-600">{hotel.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="h-5 w-5 text-yellow-500 mr-2"/>
                                    <span className="text-gray-600 font-semibold">{hotel.rating}</span>
                                </div>
                            </div>
                            <div>
                                <Link to={`/hotels/${hotel.id}`}>
                                    <button className="w-full px-6 py-2 text-white text-md font-semibold rounded-lg shadow-md bg-cyan-500 hover:opacity-90 transition cursor-pointer">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Hotels;
