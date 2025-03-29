import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { IconX } from "@tabler/icons-react"
import { useDispatch } from "react-redux";
import { updateRoom } from "../actions/hotelActions";

const schemaRoom = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  type: z.string().min(3, "Room type is required"),
  bedConfig: z.string().min(3, "Bed configuration is required"),
  guests: z.number().min(1, "At least 1 guest required"),
  price: z.number().min(1, "Price must be at least 1"),
  totalRooms: z.number().min(1, "At least 1 room required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  amenities: z.array(z.string()).optional(),
  image: z.any().optional(),
})

export default function EditRoom({ isOpen, setIsEditingRoom, room, hotelId }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaRoom),
    defaultValues: {
      name: room?.name || "",
      type: room?.type || "",
      bedConfig: room?.bed_config || "",
      guests: room?.guests || "",
      price: room?.price || "",
      totalRooms: room?.total_rooms || "",
      description: room?.description || "",
      amenities: room?.amenities || [],
      image: null,
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

    formData.append("hotel_id", hotelId);

    try {
      dispatch(updateRoom(room.id, formData));
      toast.success("Room updated successfully!")
      reset()
      setIsEditingRoom(false);
    } catch (error) {
      toast.error("Error updating room.")
    }
  }

  const closeModal = () => {
    setIsEditingRoom(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center text-gray-700 text-left items-center z-50">
      <form className="bg-white p-5 rounded-xl shadow-lg border border-gray-200" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="flex justify-between">
            <h1 className="text-gray-800 text-xl font-bold">Edit Room</h1>
            <button onClick={closeModal} type="button" className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <IconX size={20} />
            </button>
          </div>
          <p className="text-gray-400">Update the details of your room.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="space-y-4">
            <div className="flex gap-5">
              <div>
                <input {...register("name")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" placeholder="Room Name"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register("totalRooms", { valueAsNumber: true })} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" placeholder="Number of Rooms"/>
              </div>
            </div>
            <div className="w-full flex gap-5">
              <div className="w-1/2">
                <select {...register("type")} className="block w-full rounded-lg border border-gray-300 px-4 py-2">
                  <option value="">Room Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Double">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
              <div className="w-1/2">
                <select {...register("bedConfig")} className="block w-full rounded-lg border border-gray-300 px-4 py-2">
                  <option value="">Bed Configuration</option>
                  <option value="Single">Single Bed</option>
                  <option value="Double">Double Bed</option>
                  <option value="Queen">Queen Bed</option>
                  <option value="King">King Bed</option>
                </select>
                {errors.bedConfig && <p className="text-red-500 text-sm">{errors.bedConfig.message}</p>}
              </div>
            </div>
            <div className="w-full flex gap-5">
              <div className="w-1/2">
                <input {...register("guests", { valueAsNumber: true })} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" placeholder="Guests"/>
              </div>
              <div className="w-1/2">
                <input {...register("price", { valueAsNumber: true })} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" placeholder="Price per Night"/>
              </div>
            </div>
            <div>
              <textarea {...register("description")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" placeholder="Room Description"/>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
          </div>
          <div className="space-y-3">
            <div className="">
              <p className="text-md font-bold mb-2">Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Air Conditioning",
                  "Toiletries",
                  "Hairdryer",
                  "Slippers",
                  "TV",
                  "Coffee Machine",
                  "Free Wifi",
                  "Bathtub",
                ].map((item) => (
                  <label key={item} className="block">
                    <input type="checkbox" value={item} {...register("amenities")} defaultChecked={room?.amenities?.includes(item)} /> {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-md font-bold mb-2">Room Image</p>
              <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleFileChange}/>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button type="submit" className="px-5 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            Update Room
          </button>
        </div>
      </form>
    </div>
  )
} 