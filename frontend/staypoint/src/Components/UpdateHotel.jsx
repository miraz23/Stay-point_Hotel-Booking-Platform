import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IconX } from "@tabler/icons-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schemaDetails = z.object({
  name: z.string().min(3, "Hotel name must be at least 3 characters"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").transform(val => Number(val)),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  checkIn: z.string(),
  checkOut: z.string(),
})

export default function UpdateHotel({ isOpen, setIsUpdatingHotel, hotel, setHotel }) {
  const token = localStorage.getItem("token")

  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    rating: hotel?.rating || 0,
    description: hotel?.description || "",
    location: hotel?.location || "",
    checkIn: hotel?.check_in_time || "12:00",
    checkOut: hotel?.check_out_time || "10:00",
    amenities: hotel?.amenities || [],
    image: null,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaDetails),
    defaultValues: {
      name: hotel?.name || "",
      rating: hotel?.rating || 0,
      description: hotel?.description || "",
      location: hotel?.location || "",
      checkIn: hotel?.check_in_time || "12:00",
      checkOut: hotel?.check_out_time || "10:00",
    },
  })

  const handleDetailsChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleDetailsFileChange = (e) => {
    setFormData((prevState) => ({ ...prevState, image: e.target.files[0] }))
  }

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target
    setFormData(prevState => {
      const amenities = checked 
        ? [...prevState.amenities, value]
        : prevState.amenities.filter(amenity => amenity !== value)
      return { ...prevState, amenities }
    })
  }

  const closeModal = () => {
    setIsUpdatingHotel(false)
  }

  const onSubmit = async (data) => {
    const updatedData = new FormData()
    updatedData.append("name", formData.name)
    updatedData.append("rating", Number(formData.rating))
    updatedData.append("description", formData.description)
    updatedData.append("location", formData.location)
    updatedData.append("checkIn", formData.checkIn)
    updatedData.append("checkOut", formData.checkOut)
    updatedData.append("amenities", JSON.stringify(formData.amenities))
    if (formData.image) {
      updatedData.append("image", formData.image)
    }

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/hotels/${hotel.id}/update/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setHotel(response.data)
      toast.success("Hotel details updated successfully!")
      closeModal()
    } catch (error) {
      console.error("Error:", error)
      toast.error(error.response?.data?.detail || "Error updating hotel details.")
    }
  }

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        rating: hotel.rating || 0,
        description: hotel.description || "",
        location: hotel.location || "",
        checkIn: hotel.check_in_time || "12:00",
        checkOut: hotel.check_out_time || "10:00",
        amenities: hotel.amenities || [],
        image: null,
      })

      reset({
        name: hotel.name || "",
        rating: hotel.rating || 0,
        description: hotel.description || "",
        location: hotel.location || "",
        checkIn: hotel.check_in_time || "12:00",
        checkOut: hotel.check_out_time || "10:00",
      })
    }
  }, [hotel, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs text-gray-700 flex justify-center items-center z-50">
      <form className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl text-left" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="flex justify-between">
            <h1 className="text-gray-800 text-xl font-bold">Update Hotel</h1>
            <button onClick={closeModal} type="button" className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <IconX size={20} />
            </button>
          </div>
          <p className="text-gray-400">Update your hotel information.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 space-y-4">
          <div className="space-y-4">
            <div className="flex gap-5">
              <div>
                <input {...register("name")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="name" value={formData.name} onChange={handleDetailsChange} placeholder="Hotel Name"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register("rating", { valueAsNumber: true, onChange: (e) => handleDetailsChange(e)})} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" step="0.1" name="rating" value={formData.rating} placeholder="Rating (1-5)"/>
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
              </div>
            </div>

            <div>
              <textarea {...register("description")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" name="description" value={formData.description} onChange={handleDetailsChange} placeholder="Hotel Description" rows="3"/>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <input {...register("location")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="location" value={formData.location} onChange={handleDetailsChange} placeholder="Hotel Location"/>
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div>
              <p className="text-md font-bold mb-2">Hotel Image</p>
              <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleDetailsFileChange}/>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-5 w-full">
              <div className="w-1/2">
                <p className="text-md font-bold mb-4">Check-in Time:</p>
                <input {...register("checkIn")} type="time" name="checkIn" value={formData.checkIn} onChange={handleDetailsChange} className="block w-full rounded-lg border border-gray-300 px-4 py-2"/>
                {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn.message}</p>}
              </div>
              <div className="w-1/2">
                <p className="text-md font-bold mb-4">Check-out Time:</p>
                <input {...register("checkOut")} type="time" name="checkOut" value={formData.checkOut} onChange={handleDetailsChange} className="block w-full rounded-lg border border-gray-300 px-4 py-2"/>
                {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut.message}</p>}
              </div>
            </div>

            <div>
              <p className="text-md font-bold mb-4">Amenities:</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Room service",
                  "Free Wifi",
                  "Swimming pool",
                  "Air conditioning",
                  "Parking",
                  "24h-Front Desk",
                  "Gym",
                  "Restaurant",
                ].map((item) => (
                  <label key={item} className="block">
                    <input 
                      type="checkbox" 
                      value={item} 
                      checked={formData.amenities.includes(item)}
                      onChange={handleAmenityChange}
                    /> {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button type="submit" className="px-5 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
} 