import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from './Loader';
import Message from './Message';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { IconEdit, IconClock, IconBellQuestion, IconWifi, IconSwimming, IconAirConditioning, IconCar, IconBarbell, IconToolsKitchen3  } from '@tabler/icons-react';
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
                      <div className='flex items-center justify-between'>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                              <h1 className='text-4xl font-semibold'>{hotel.name}</h1>
                              <div className="flex items-center">
                                <StarIcon className="h-5 w-5 text-yellow-500 mr-2"/>
                                <span className="text-gray-600 text-2xl font-semibold">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center py-3">
                              <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
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
                              <p className="text-md font-medium">{hotel.check_in_time}</p>
                            </div>
                          </div>
                          <div className="flex items-center pt-5">
                            <IconClock className='mr-2' />
                            <div>
                              <p className="text-md text-muted-foreground">Check-out</p>
                              <p className="text-md font-medium">{hotel.check_out_time}</p>
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
              </div>
            )}
        </div>
    );
};

export default HotelDashboard;