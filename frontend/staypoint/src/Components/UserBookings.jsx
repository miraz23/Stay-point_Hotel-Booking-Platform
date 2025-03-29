import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IconMapPin, IconBed, IconUsers, IconHotelService, IconCalendarCheck, IconAdjustmentsHorizontal, IconWallet } from '@tabler/icons-react';

export default function UserBookings() {
  const [bookings, setBookings] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookings(response.data)
      } catch (error) {
        toast.error("Failed to fetch bookings.")
      }
    }

    if (token) fetchBookings()
  }, [token])

  if (!bookings.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-4">My Bookings</h2>
        <p className="text-gray-600">You haven't made any bookings yet.</p>
      </div>
    )
  }

  return (
    <div className="pt-10">
      <h1 className="text-4xl text-gray-800 py-4">
          My<span className="text-cyan-600"> Bookings</span>
      </h1>
      <div className="flex gap-5 mt-5 flex-wrap">
        {bookings.map((booking) => (
          <div key={booking.id} className="w-full md:w-[calc(50%-12px)] flex flex-col justify-between border-1 border-gray-200 rounded-lg p-4 bg-white shadow-2xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-semibold">{booking.hotel_name}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-5">
              <IconMapPin size={20} className="mr-2" />
              <span>{booking.hotel_location}</span>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-5 border-b-1 border-gray-300">
              <div>
                <p className="text-gray-600 mb-2">Check-in</p>
                <div className="flex items-center">
                  <IconCalendarCheck className="mr-2 text-gray-600" />
                  <span className="text-lg text-gray-800 font-semibold">
                    {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Check-out</p>
                <div className="flex items-center">
                  <IconCalendarCheck className="mr-2 text-gray-600" />
                  <span className="text-lg text-gray-800 font-semibold">
                    {new Date(booking.check_out_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="my-6 grid grid-cols-2 gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <IconHotelService size={18} className="mr-2" />
                  <p className="text-md text-gray-800 font-semibold">{booking.room_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <IconUsers size={18} className="mr-2" />
                <p className="text-md text-gray-800 font-semibold">{booking.room_guests} Guests</p>
              </div>
              <div className="flex items-center">
                <IconBed size={18} className="mr-2" />
                  <p className="text-md text-gray-800 font-semibold">{booking.room_bed_config} Bed</p>
              </div>
              <div className="flex items-center">
                <IconAdjustmentsHorizontal size={18} className="mr-2" />
                <p className="text-md text-gray-800 font-semibold">{booking.room_type} Room</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <IconWallet size={20} className="mr-2" />
                <p className="text-lg text-gray-800 font-semibold"> {booking.room_price} Tk</p>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                Cancel Booking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 