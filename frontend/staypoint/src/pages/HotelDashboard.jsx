import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { IconEdit, IconClock, IconBellQuestion, IconWifi, IconSwimming, IconAirConditioning, IconCar, IconBarbell, IconToolsKitchen3, IconCirclePlus, IconBed, IconUsers, IconAdjustmentsHorizontal, IconCalendarCheck, IconTrash } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import AddRoom from '../components/AddRoom'
import UpdateHotel from '../components/UpdateHotel'
import EditRoom from '../components/EditRoom'
import HotelBookings from '../components/HotelBookings'
import HotelAnalytics from '../components/HotelAnalytics'
import { deleteRoom } from '../actions/hotelActions';
import { toast } from 'react-hot-toast';

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

  // Showing add room modal
  const [isAddingRoom, setisAddingRoom] = useState(false)
  // Showing update hotel modal
  const [isUpdatingHotel, setIsUpdatingHotel] = useState(false)
  // Showing edit room modal
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  // Selected room for editing
  const [selectedRoom, setSelectedRoom] = useState(null)

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsEditingRoom(true);
  }

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        dispatch(deleteRoom(roomId));
        toast.success('Room deleted successfully');
        dispatch(listHotelDetails(id)); // Refresh hotel details
      } catch (error) {
        toast.error('Error deleting room');
      }
    }
  }

  return (
      <div className="text-center my-30 mx-10">
          {loading ? (
              <Loader />
          ) : error ? (
              <Message variant='danger'>{error}</Message>
          ) : (
            <div>
              <div className="mt-10">
                <HotelAnalytics hotelId={id} />
              </div>

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
                              <button onClick={() => setIsUpdatingHotel(true)} className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors p-2 rounded-md relative" title="Update Hotel">
                                <IconEdit size={28} />
                              </button>
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
                    <h1 className='text-gray-700 text-left text-xl font-semibold'>Rooms</h1>
                    <button onClick={() => setisAddingRoom(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                      <IconCirclePlus className="mr-1" /> Add Room
                    </button>
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
                            <span className="flex text-gray-600 text-sm font-semibold items-center"><IconCalendarCheck size={22} className='mr-1'/> {room.total_rooms} Rooms</span>
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
                        <div className='w-full flex gap-2'>
                          <div className='border-1 border-gray-300 w-1/2 py-2 text-gray-600 cursor-pointer hover:bg-gray-100 flex items-center justify-center'onClick={() => handleEditRoom(room)}>
                            <IconEdit size={20} className="mr-1" /> Edit
                          </div>
                          <div className='border-1 border-gray-300 w-1/2 py-2 text-red-500 cursor-pointer hover:bg-red-50 flex items-center justify-center'onClick={() => handleDeleteRoom(room.id)}>
                            <IconTrash size={20} className="mr-1" /> Delete
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className='flex flex-col justify-center items-center p-10'>
                      <IconBed size={128} className='text-gray-300' />
                      <p className='text-xl text-gray-400'>No rooms added yet. Click "Add Room" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isAddingRoom && <AddRoom setisAddingRoom={setisAddingRoom} isOpen={isAddingRoom} hotelId={hotel.id} />}
          {isUpdatingHotel && <UpdateHotel setIsUpdatingHotel={setIsUpdatingHotel} isOpen={isUpdatingHotel} hotel={hotel} setHotel={(updatedHotel) => dispatch({ type: 'HOTEL_DETAILS_SUCCESS', payload: updatedHotel })} />}
          {isEditingRoom && <EditRoom setIsEditingRoom={setIsEditingRoom} isOpen={isEditingRoom} room={selectedRoom} hotelId={hotel.id} />}
          
          {/* Hotel Bookings Component */}
          <HotelBookings hotelId={id} />
      </div>
  );
};

export default HotelDashboard;