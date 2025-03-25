"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IconEdit, IconMapPinPlus } from "@tabler/icons-react"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { listHotels } from "../actions/hotelActions"
import ListHotel from "./ListHotel"
import UpdateProfile from "./UpdateProfile"
import UserListedHotels from "./UserListedHotels"

const schemaDetails = z.object({
  fname: z.string().min(2, "First name must be at least 2 characters"),
  lname: z.string().min(2, "Last name must be at least 2 characters"),
  contactNo: z.string().min(11, "Contact number must be 11 digits"),
  address: z.string().min(3, "Address is required"),
  nid: z.string().min(10, "NID must be 10 characters"),
})

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const token = localStorage.getItem("token")

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
      } catch (error) {
        toast.error("Failed to fetch user details.")
      }
    }

    if (token) fetchUserDetails()
  }, [token])

  // Showing listed hotels on profile
  const dispatch = useDispatch()
  const hotelsList = useSelector((state) => state.hotelsList)
  const { hotels } = hotelsList

  useEffect(() => {
    dispatch(listHotels())
  }, [dispatch])

  //for update profile modal
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  //for listing hotel modal
  const [isListingHotel, setIsListingHotel] = useState(false)

  return (
    <div className="mx-10 my-30">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {user ? (
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
        ) : (
          <p className="w-full text-lg text-gray-600 text-center italic">User details not found.</p>
        )}
      </div>

      {/* ListHotel Component */}
      {isListingHotel && 
        <ListHotel 
          setIsListingHotel={setIsListingHotel} 
          isOpen={isListingHotel} 
        />
      }

      {/* UpdateProfile Modal */}
      {isUpdatingProfile && (
        <UpdateProfile
          isOpen={isUpdatingProfile}
          setIsUpdatingProfile={setIsUpdatingProfile}
          user={user}
          setUser={setUser}
        />
      )}

      {/* Listed Hotels Component */}
      {user && 
        <UserListedHotels 
          user={user} 
          hotels={hotels || []} 
        />
      }

    </div>
  )
}