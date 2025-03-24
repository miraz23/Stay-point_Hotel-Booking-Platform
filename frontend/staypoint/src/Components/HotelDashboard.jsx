import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from './Loader';
import Message from './Message';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { IconEdit, IconClock, IconBellQuestion, IconWifi, IconSwimming, IconAirConditioning, IconCar, IconBarbell, IconToolsKitchen3, IconCirclePlus, IconBed } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const HotelDashboard = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const hotelDetails = useSelector(state => state.hotelDetails);
    const { loading, error, hotel } = hotelDetails;

    useEffect(() => {
        dispatch(listHotelDetails(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    const amenityIcons = {
      "Room service": <IconBellQuestion  />,
      "Free Wifi": <IconWifi />,
      "Swimming pool": <IconSwimming />,
      "Air conditioning": <IconAirConditioning />,
      "Parking": <IconCar />,
      "24h-Front Desk": <IconClock />,
      "Gym": <IconBarbell />,
      "Restaurant": <IconToolsKitchen3 />,
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";

    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) return "Invalid Time";

    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };



  return (
      <div className="text-center my-30 mx-10">
          {loading ? (
              <Loader />
          ) : error ? (
              <Message variant='danger'>{error}</Message>
          ) : (
            <div>
              <div className='w-full flex gap-x-10'>
                  <div className='w-1/2 aspect-[3/2]'>
                      {hotel.image ? (
                          <img src={`http://127.0.0.1:8000/${hotel.image}`} alt={hotel.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                          <img src="/default-hotel.jpg" alt={hotel.name} className="w-full h-full object-cover rounded-lg" />
                      )}
                  </div>
                  <div className='w-1/2 text-left'>
                    <div className='flex items-center justify-between pb-2'>
                      <div className='w-full'>
                          <div className='flex justify-between'>
                            <div className='flex items-center'>
                              <h1 className='text-4xl font-semibold'>{hotel.name}</h1>
                              <Link>
                                <button className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors p-2 rounded-md relative" title="Update Hotel">
                                  <IconEdit size={28} />
                                </button>
                              </Link>
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="h-5 w-5 text-yellow-500 mr-2"/>
                              <span className="text-gray-600 text-2xl font-semibold">{hotel.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center py-3">
                            <MapPinIcon className="h-6 w-6 text-cyan-500 mr-2" />
                            <span className="text-gray-600">{hotel.location}</span>
                          </div>
                      </div>
                    </div>
                    <div className='border-1 border-gray-300 rounded-xl p-5'>
                      <div className='pb-5 border-b-1 border-gray-300'>
                        <h1 className='text-gray-700 text-xl mb-2 font-semibold'>About</h1>
                        <p className='text-[16px]'>{hotel.description}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center pt-5">
                          <IconClock className='mr-2' />
                          <div>
                            <p className="text-md text-muted-foreground">Check-in</p>
                            <p className="text-md font-medium">{formatTime(hotel.check_in_time)}</p>
                          </div>
                        </div>
                        <div className="flex items-center pt-5">
                          <IconClock className='mr-2' />
                          <div>
                            <p className="text-md text-muted-foreground">Check-out</p>
                            <p className="text-md font-medium">{formatTime(hotel.check_out_time)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className='mt-10 border-1 border-gray-300 rounded-xl p-5'>
                <div>
                  <h1 className='text-gray-700 text-left text-xl pb-5 font-semibold'>Popular Amenities</h1>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {hotel.amenities && hotel.amenities.length > 0 && hotel.amenities.map((amenity, index) => (
                      <div key={index} className='flex items-center'>
                        <span className='bg-slate-200 p-2 rounded-full mr-2'>{amenityIcons[amenity]}</span>
                        <span className='text-gray-700'>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='mt-10 border-1 border-gray-300 rounded-xl p-5'>
                <div>
                  <div className='flex justify-between items-center'>
                    <h1 className='text-gray-700 text-left text-xl pb-5 font-semibold'>Rooms</h1>
                    <button className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                      <IconCirclePlus className="mr-1" /> Add Room
                    </button>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-col justify-center items-center p-10'>
                      <IconBed size={128} className='text-gray-300' />
                      <p className='text-xl text-gray-400'>No rooms added yet. Click "Add Room" to get started.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
          )}
      </div>
  );
};

export default HotelDashboard;