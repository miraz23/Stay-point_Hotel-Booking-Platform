import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from './Loader';
import Message from './Message';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { IconClock, IconBellQuestion, IconWifi, IconSwimming, IconAirConditioning, IconCar, IconBarbell, IconToolsKitchen3, IconBed, IconUsers, IconAdjustmentsHorizontal, IconCalendarCheck, IconCalendarPlus } from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Hotel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [roomDates, setRoomDates] = useState({});

    const hotelDetails = useSelector(state => state.hotelDetails);
    const { loading, error, hotel } = hotelDetails;
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch(listHotelDetails(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    const handleDateChange = (roomId, dateType, value) => {
        setRoomDates(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                [dateType]: value
            }
        }));
    };

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

  const handleBooking = async (roomId) => {
    if (!userInfo) {
        toast.error('Please login to make a booking');
        return;
    }

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(
            'http://127.0.0.1:8000/api/bookings/create/',
            {
                roomId,
                hotelId: hotel.id,
                checkIn: roomDates[roomId].checkIn,
                checkOut: roomDates[roomId].checkOut,
            },
            config
        );

        toast.success('Booking created successfully!');
        setRoomDates({});
        navigate('/auth/profile');
    } catch (error) {
        toast.error(error.response?.data?.detail || 'Error creating booking');
    }
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
                            <div>
                              <h1 className='text-4xl font-semibold'>{hotel.name}</h1>
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
                  <div>
                    <h1 className='text-gray-700 text-left text-xl font-semibold'>Rooms</h1>
                  </div>
                  {hotel.rooms && hotel.rooms.length > 0 ? (
                    <div className='flex gap-5 mt-5 flex-wrap'>
                      {hotel.rooms.map((room) => (
                      <div className="w-full md:w-[calc(50%-12px)] flex flex-col justify-between border-1 border-gray-200 rounded-lg p-4 bg-white shadow-2xl" key={room.id}>
                        <div className="flex flex-col justify-center items-center mb-4">
                            <div className="aspect-[3/2] flex items-center justify-center rounded-xl">
                                {room.image ? (
                                    <img className="w-full h-full object-cover rounded-xl" src={`http://127.0.0.1:8000/${room.image}`} alt={room.name} />
                                ) : (
                                    <img className="w-full h-full object-cover rounded-xl" src="/default-room.jpg" alt="Hotel Logo" />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between mb-5">
                            <div className="flex items-center">
                              <h1 className="text-xl font-bold text-gray-700">{room.name}</h1>
                            </div>
                            <div className="flex items-center">
                                <span className="text-cyan-600 font-bold">${room.price}</span>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 mb-5">
                            <span className="flex text-gray-600 text-sm font-semibold items-center"><IconUsers size={20} className='mr-1'/> {room.guests} Guests</span>
                            <span className="flex text-gray-600 text-sm font-semibold items-center"><IconAdjustmentsHorizontal size={20} className='mr-1'/> {room.type} Room</span>
                            <span className="flex text-gray-600 text-sm font-semibold items-center"><IconBed size={22} className='mr-1'/> {room.bed_config} Bed</span>
                            <span className="flex text-gray-600 text-sm font-semibold items-center"><IconCalendarCheck size={22} className='mr-1'/> {room.total_rooms} Available</span>
                        </div>
                        <div>
                          <p className='text-gray-600 text-left'>{room.description}</p>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 my-5'>
                          {room.amenities.map((amenity, index) => (
                            <div key={index} className='flex items-center justify-center bg-gray-100 text-xs rounded-xl py-1'>
                              <span className='text-gray-700'>{amenity}</span>
                            </div>
                          ))}
                        </div>
                        <div className='flex gap-4 pb-5 text-left text-gray-600'>
                          <div className='flex-1'>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Check-in</label>
                            <input type="date" value={roomDates[room.id]?.checkIn || ''} onChange={(e) => handleDateChange(room.id, 'checkIn', e.target.value)}  min={new Date().toISOString().split('T')[0]}  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                          </div>
                          <div className='flex-1'>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Check-out</label>
                            <input type="date" value={roomDates[room.id]?.checkOut || ''} onChange={(e) => handleDateChange(room.id, 'checkOut', e.target.value)}  min={roomDates[room.id]?.checkIn || new Date().toISOString().split('T')[0]}  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                          </div>
                        </div>
                        <div className='w-full flex gap-2'>
                          <button 
                            className={`w-full px-6 py-2 text-white text-md font-semibold rounded-lg shadow-md ${!roomDates[room.id]?.checkIn || !roomDates[room.id]?.checkOut || room.total_rooms <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-500 hover:opacity-90 transition cursor-pointer'} flex items-center justify-center gap-2`}
                            disabled={!roomDates[room.id]?.checkIn || !roomDates[room.id]?.checkOut || room.total_rooms <= 0}
                            onClick={() => handleBooking(room.id)}>
                            <IconCalendarPlus size={20} />
                            {room.total_rooms <= 0 
                              ? 'No rooms available' 
                              : !roomDates[room.id]?.checkIn || !roomDates[room.id]?.checkOut 
                                ? 'Select dates to book' 
                                : `Book for ${roomDates[room.id].checkIn} - ${roomDates[room.id].checkOut}`}
                        </button>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className='flex flex-col justify-center items-center p-10'>
                      <IconBed size={128} className='text-gray-300' />
                      <p className='text-xl text-gray-400'>No rooms available. Check again later.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
  );
};

export default Hotel;