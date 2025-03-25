import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { IconX } from "@tabler/icons-react"

const schemaHotel = z.object({
  name: z.string().min(3, "Hotel name must be at least 3 characters"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  image: z.any().optional(),
  checkIn: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  checkOut: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  amenities: z.array(z.string()).optional(),
})

export default function ListHotel(props) {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaHotel),
    defaultValues: {
      name: "",
      rating: "",
      description: "",
      location: "",
      image: null,
      checkIn: "12:00",
      checkOut: "10:00",
      amenities: [],
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setValue("image", file)
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key]) {
        formData.append(key, data[key])
      } else if (key === "amenities") {
        formData.append("amenities", JSON.stringify(data.amenities))
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      await axios.post("http://127.0.0.1:8000/api/hotels/add-hotel/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Hotel listed successfully!")
      reset()
      if (token) {
        navigate("/auth/profile")
        closeModal()
      } else {
        toast.error("You must be logged in to add a hotel.")
      }
    } catch (error) {
      toast.error("Error listing hotel.")
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(true)
  const closeModal = () => {
    setIsModalOpen(false)
    props.setIsListingHotel(false)
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs text-gray-700 flex justify-center items-center z-50">
      <form className="bg-white p-5 rounded-xl shadow-lg border border-gray-200" onSubmit={handleSubmit(onSubmit)}>
        
        <div className="mb-5">
          <div className="flex justify-between">
            <h1 className="text-gray-800  text-xl font-bold">List Hotel</h1>
            <button onClick={closeModal} type="button" className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <IconX size={20} />
            </button>
          </div>
          <p className="text-gray-400">Fill in the details to list your hotel.</p>
        </div>
          

        <div className="flex flex-col md:flex-row gap-10 space-y-4">
          <div className="space-y-4">
            <div className="flex gap-5">
              <div>
                <input {...register("name")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" placeholder="Hotel Name"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register("rating", { valueAsNumber: true })} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" placeholder="Rating (1-5)"/>
                {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
              </div>
            </div>

            <div>
              <textarea {...register("description")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" placeholder="Hotel Description"/>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <input {...register("location")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" placeholder="Hotel Location"/>
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div>
            <p className="text-md font-bold mb-2">Hotel Image</p>
              <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleFileChange}/>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-5 w-full">
              <div className="w-1/2">
                <p className="text-md font-bold mb-3">Check-in Time:</p>
                <input {...register("checkIn")} type="time" className="block w-full rounded-lg border border-gray-300 px-4 py-2"/>
                {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn.message}</p>}
              </div>
              <div className="w-1/2">
                <p className="text-md font-bold mb-3">Check-out Time:</p>
                <input {...register("checkOut")} type="time" className="block w-full rounded-lg border border-gray-300 px-4 py-2"/>
                {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut.message}</p>}
              </div>
            </div>

            <div>
              <p className="text-md font-bold mb-3">Amenities:</p>
              <div className="grid grid-cols-2 gap-3">
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
                    <input type="checkbox" value={item} {...register("amenities")} /> {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button type="submit" className="px-5 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  )
}