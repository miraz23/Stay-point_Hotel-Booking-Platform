import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IconX } from "@tabler/icons-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schemaDetails = z.object({
    fname: z.string().min(2, "First name must be at least 2 characters"),
    lname: z.string().min(2, "Last name must be at least 2 characters"),
    contactNo: z.string().min(11, "Contact number must be 11 digits"),
    address: z.string().min(3, "Address is required"),
    nid: z.string().min(10, "NID must be 10 characters"),
})

export default function UpdateProfile({ isOpen, setIsUpdatingProfile, user, setUser }) {
    const token = localStorage.getItem("token")

    const [formData, setFormData] = useState({
        fname: user?.name.split(" ")[0] || "",
        lname: user?.name.split(" ")[1] || "",
        email: user?.email || "",
        contactNo: user?.contact_no || "",
        address: user?.address || "",
        nid: user?.nid_number || "",
        image: null,
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaDetails),
        defaultValues: {
            fname: user?.name.split(" ")[0] || "",
            lname: user?.name.split(" ")[1] || "",
            contactNo: user?.contact_no || "",
            address: user?.address || "",
            nid: user?.nid_number || "",
        },
    })

    const handleDetailsChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleDetailsFileChange = (e) => {
        setFormData((prevState) => ({ ...prevState, image: e.target.files[0] }))
    }

    const closeModal = () => {
        setIsUpdatingProfile(false)
    }

    const onSubmit = async (data) => {
        const updatedData = new FormData()
        updatedData.append("fname", formData.fname)
        updatedData.append("lname", formData.lname)
        updatedData.append("email", formData.email)
        updatedData.append("contactNo", formData.contactNo)
        updatedData.append("address", formData.address)
        updatedData.append("nid", formData.nid)
        if (formData.image) {
            updatedData.append("image", formData.image)
        }

        try {
            const response = await axios.put("http://127.0.0.1:8000/api/users/update-profile/", updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            setUser(response.data)
            toast.success("Profile updated successfully!")
            closeModal()
        } catch (error) {
            toast.error("Error updating profile.")
        }
    }

    useEffect(() => {
        if (user) {
            setFormData({
                fname: user.name.split(" ")[0] || "",
                lname: user.name.split(" ").slice(1).join(" ") || "",
                email: user.email || "",
                contactNo: user.contact_no || "",
                address: user.address || "",
                nid: user.nid_number || "",
                image: null,
            })
        }
    }, [user])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center text-gray-700 text-left items-center z-50">
            <form className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl"    onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <div className="flex justify-between">
                        <h1 className="text-gray-800 text-xl font-bold">Update Profile</h1>
                        <button onClick={closeModal} type="button" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                            <IconX size={20} />
                        </button>
                    </div>
                    <p className="text-gray-400">Update your personal information.</p>
                </div>
        
                <div className="space-y-4">
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input {...register("fname")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="fname" value={formData.fname} onChange={handleDetailsChange}/>
                            {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input {...register("lname")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="lname" value={formData.lname} onChange={handleDetailsChange}/>
                            {errors.lname && <p className="text-red-500 text-sm">{errors.lname.message}</p>}
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Contact Number</label>
                            <input {...register("contactNo")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="contactNo" value={formData.contactNo} onChange={handleDetailsChange}/>
                            {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">NID Number</label>
                            <input {...register("nid")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="nid" value={formData.nid} onChange={handleDetailsChange}/>
                            {errors.nid && <p className="text-red-500 text-sm">{errors.nid.message}</p>}
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input {...register("address")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="address" value={formData.address} onChange={handleDetailsChange}/>
                            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Profile Image</label>
                            <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleDetailsFileChange}/>
                        </div>
                    </div>

                    <div className="flex justify-center mt-5">
                        <button type="submit" className="flex items-center px-5 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}