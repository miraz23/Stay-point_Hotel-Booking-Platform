import { Link } from "react-router-dom"
import { IconMapPinPlus, IconTrendingUp } from "@tabler/icons-react"

export default function UserListedHotels({ user, hotels }) {
  if (!user?.is_host) return null

  const userHotels = hotels.filter((hotel) => hotel.user === user?.id)

  if (userHotels.length === 0) {
    return (
      <div className="pt-10">
        <h1 className="text-4xl text-gray-800 py-4">
          Your <span className="text-cyan-600">Listed Hotels</span>
        </h1>
        <div className="w-full p-8 text-center bg-white rounded-lg shadow-lg">
          <p className="text-gray-500 text-lg">You haven't listed any hotels yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-10">
      <h1 className="text-4xl text-gray-800 py-4">
        Your <span className="text-cyan-600">Listed Hotels</span>
      </h1>
      <div className="w-full flex flex-wrap gap-4">
        {userHotels.map((hotel) => (
          <div
            className="w-full md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-lg transition-transform transform hover:scale-101 hover:shadow-2xl"
            key={hotel.id}
          >
            <div className="flex items-center w-full">
              <div className="w-24 h-24 aspect-[3/2] flex items-center justify-center rounded-xl overflow-hidden shadow-md">
                {hotel.image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://127.0.0.1:8000${hotel.image}`}
                    alt="Hotel Logo"
                  />
                ) : (
                  <img className="w-full h-full object-cover" src="/default-hotel.jpg" alt="Hotel Logo" />
                )}
              </div>

              <div className="flex flex-col flex-grow pl-4">
                <h1 className="text-xl font-bold text-gray-800">{hotel.name}</h1>
                <span className="text-gray-600 flex items-center">
                  <IconMapPinPlus className="h-5 w-5 text-blue-500 mr-1" />
                  {hotel.location}
                </span>
                <div className="flex items-center text-gray-600 mt-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium shadow-inner">
                    Total: 27 Rooms
                  </span>
                  <span className="bg-green-100 px-3 py-1 rounded-md text-sm font-medium shadow-inner ml-2">
                    Available: 10 Rooms
                  </span>
                </div>
              </div>
            </div>

            <Link to={`/hotel-dashboard/${hotel.id}`}>
              <button className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition-colors p-2 rounded-md hover:bg-gray-100">
                <IconTrendingUp />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}