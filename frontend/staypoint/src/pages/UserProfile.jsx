import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { listHotels } from "../actions/hotelActions"
import ListHotel from "../components/ListHotel"
import UpdateProfile from "../components/UpdateProfile"
import UserListedHotels from "../components/UserListedHotels"
import UserDetails from "../components/UserDetails"
import UserBookings from "../components/UserBookings"

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
      {/* User Details Component */}
      <UserDetails 
        user={user}  
        setIsUpdatingProfile={setIsUpdatingProfile} 
        setIsListingHotel={setIsListingHotel} 
      />

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

      {/* User Bookings Component */}
      <UserBookings />
    </div>
  )
}