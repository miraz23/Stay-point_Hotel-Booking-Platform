import { IconEdit, IconMapPinPlus } from "@tabler/icons-react"

export default function UserDetails({ user, setIsUpdatingProfile, setIsListingHotel }) {
  if (!user) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <p className="w-full text-lg text-gray-600 text-center italic">User details not found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between flex-col md:flex-row items-center">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {user.image && user.image !== "N/A" ? (
            <img src={user.image || "/placeholder.svg"} alt="Profile" className="w-32 h-32 border border-gray-300 rounded-full sm:rounded-none object-cover"/>
          ) : (
            <img src="/profile-user.png" alt="Default Profile" className="w-32 h-32 border border-gray-300 rounded-full sm:rounded-none object-cover"/>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600">
              <strong>Contact:</strong> {user.contact_no || "N/A"}
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> {user.address || "N/A"}
            </p>
            <p className="text-gray-600">
              <strong>NID:</strong> {user.nid_number || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-5 mt-7 md:mt-0">
          <button onClick={() => setIsUpdatingProfile(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            <IconEdit className="mr-1" /> Update profile
          </button>

          <button onClick={() => setIsListingHotel(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            <IconMapPinPlus className="mr-1" /> List your hotel
          </button>
        </div>
      </div>
    </div>
  )
}