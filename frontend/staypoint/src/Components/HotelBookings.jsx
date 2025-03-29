import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IconMapPin, IconPhone, IconMail, IconId, IconBed, IconUsers, IconHotelService, IconCalendarCheck, IconAdjustmentsHorizontal, IconCurrencyTaka, IconMoon, IconWallet, IconUser } from '@tabler/icons-react';

export default function HotelBookings({ hotelId }) {
  const [bookings, setBookings] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/hotels/${hotelId}/bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookings(response.data)
      } catch (error) {
        toast.error("Failed to fetch bookings.")
      }
    }

    if (token && hotelId) fetchBookings()
  }, [token, hotelId])

  if (!bookings.length) {
    return (
      <div className='mt-6 md:mt-10 border-1 border-gray-300 rounded-xl p-4 md:p-5'>
        <div>
          <h1 className='text-gray-700 text-left text-lg md:text-xl font-semibold'>Hotel Bookings</h1>
          <div className='flex flex-col justify-center items-center p-6 md:p-10'>
            <IconBed size={96} className='text-gray-300 md:size-128' />
            <p className='text-lg md:text-xl text-gray-400'>No bookings found for this hotel.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mt-6 md:mt-10 border-1 border-gray-300 rounded-xl p-4 md:p-5'>
      <div>
        <h1 className='text-gray-700 text-left text-lg md:text-xl font-semibold'>Hotel Bookings</h1>
        <div className="flex gap-4 md:gap-5 mt-4 md:mt-5 flex-wrap">
          {bookings.map((booking) => (
            <div key={booking.id} className="w-full md:w-[calc(50%-12px)] flex flex-col justify-between border-1 border-gray-200 rounded-lg p-3 md:p-4 bg-white shadow-2xl">
              <div className="flex items-start mb-2">
                  <h3 className="text-lg md:text-xl font-semibold">{booking.user_name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 pb-4 md:pb-5 border-b-1 border-gray-300">
                <div className="flex items-center text-gray-600">
                  <IconMail size={16} className="mr-2" />
                  <span className="text-sm md:text-base">{booking.user_email}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <IconPhone size={16} className="mr-2" />
                  <span className="text-sm md:text-base">{booking.user_contact}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <IconMapPin size={16} className="mr-2" />
                  <span className="text-sm md:text-base">{booking.user_address}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <IconId size={16} className="mr-2" />
                  <span className="text-sm md:text-base">{booking.user_nid}</span>
                </div>
              </div>

              <div className="flex items-start mt-4 md:mt-5">
                  <h3 className="text-lg md:text-xl font-semibold">Booking Details</h3>
              </div>

              <div className="my-4 md:my-5 grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <IconHotelService size={16} className="mr-2" />
                    <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.room_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IconUsers size={16} className="mr-2" />
                  <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.room_guests} Guests</p>
                </div>
                <div className="flex items-center">
                  <IconBed size={16} className="mr-2" />
                  <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.room_bed_config} Bed</p>
                </div>
                <div className="flex items-center">
                  <IconAdjustmentsHorizontal size={16} className="mr-2" />
                  <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.room_type} Room</p>
                </div>
                <div className="flex items-center">
                  <IconCurrencyTaka size={18} className="mr-2" />
                  <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.room_price} Tk</p>
                </div>
                <div className="flex items-center">
                  <IconMoon size={16} className="mr-2" />
                  <p className="text-sm md:text-md text-gray-800 font-semibold">{booking.total_nights} Night</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                <div>
                  <p className="text-gray-800 mb-2 text-sm md:text-base">Check-in</p>
                  <div className="flex items-center">
                    <IconCalendarCheck size={16} className="mr-2 text-gray-600" />
                    <span className="text-sm md:text-md text-gray-800 font-semibold">
                      {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-800 mb-2 text-sm md:text-base">Check-out</p>
                  <div className="flex items-center">
                    <IconCalendarCheck size={16} className="mr-2 text-gray-600" />
                    <span className="text-sm md:text-md text-gray-800 font-semibold">
                      {new Date(booking.check_out_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                  <div className="flex items-center">
                    <IconWallet size={18} className="mr-2" />
                    <span className="text-gray-600 text-sm md:text-base">Total Price:</span>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-cyan-600">{booking.total_price} Tk</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 