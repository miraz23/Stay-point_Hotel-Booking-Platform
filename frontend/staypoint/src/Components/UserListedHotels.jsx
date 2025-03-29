import { Link } from "react-router-dom"
import { IconMapPinPlus, IconTrendingUp, IconTrash } from "@tabler/icons-react"
import { useDispatch } from 'react-redux'
import { deleteHotel } from '../actions/hotelActions'
import { toast } from 'react-hot-toast'

export default function UserListedHotels({ user, hotels }) {
  const dispatch = useDispatch()

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        dispatch(deleteHotel(hotelId))
        toast.success('Hotel deleted successfully')
      } catch (error) {
        toast.error(error.message || 'Failed to delete hotel')
      }
    }
  }

  if (!user?.is_host) return null

  const userHotels = hotels.filter((hotel) => hotel.user === user?.id)

  if (userHotels.length === 0) {
    return (
      <div className="pt-6 md:pt-10">
        <h1 className="text-2xl md:text-4xl text-gray-800 py-3 md:py-4">
          Your <span className="text-cyan-600">Listed Hotels</span>
        </h1>
        <div className="w-full p-6 md:p-8 text-center bg-white rounded-lg shadow-lg">
          <p className="text-gray-500 text-base md:text-lg">You haven't listed any hotels yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6 md:pt-10">
      <h1 className="text-2xl md:text-4xl text-gray-800 py-3 md:py-4">
        Your <span className="text-cyan-600">Listed Hotels</span>
      </h1>
      <div className="w-full flex flex-wrap gap-3 md:gap-4">
        {userHotels.map((hotel) => (
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-xl p-3 md:p-4 bg-white shadow-lg transition-transform transform hover:scale-101 hover:shadow-2xl" key={hotel.id}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3 md:gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 aspect-[3/2] flex items-center justify-center rounded-xl overflow-hidden shadow-md">
                {hotel.image ? (
                  <img className="w-full h-full object-cover" src={`http://127.0.0.1:8000${hotel.image}`} alt="Hotel Logo"/>
                ) : (
                  <img className="w-full h-full object-cover" src="/default-hotel.jpg" alt="Hotel Logo" />
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <h1 className="text-lg md:text-xl font-bold text-gray-800">{hotel.name}</h1>
                <span className="text-sm md:text-base text-gray-600 flex items-center">
                  <IconMapPinPlus className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-1" />
                  {hotel.location}
                </span>
                <div className="flex flex-wrap items-center text-gray-600 mt-2 gap-2">
                  <span className="bg-gray-100 px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium shadow-inner">
                    Total: {hotel.rooms.reduce((sum, room) => sum + room.total_rooms + room.booked_rooms, 0)} Room
                  </span>
                  <span className="bg-green-100 px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium shadow-inner">
                    Available: {hotel.rooms.reduce((sum, room) => sum + room.total_rooms, 0)} Room
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <Link to={`/hotel-dashboard/${hotel.id}`}>
                <button className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors p-2 rounded-md hover:bg-gray-100">
                  <IconTrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </Link>
              <button onClick={() => handleDeleteHotel(hotel.id)} className="text-red-500 cursor-pointer hover:text-red-600 transition-colors p-2 rounded-md hover:bg-gray-100">
                <IconTrash className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}