import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { IconEdit, IconCheck, IconX, IconMapPinPlus } from '@tabler/icons-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaDetails = z.object({
  fname: z.string().min(2, "First name must be at least 2 characters"),
  lname: z.string().min(2, "Last name must be at least 2 characters"),
  contactNo: z.string().min(11, "Contact number must be 11 digits"),
  address: z.string().min(3, "Address is required"),
  nid: z.string().min(10, "NID must be 10 characters"),
});

const schemaHotel = z.object({
  name: z.string().min(3, "Hotel name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(3, "Location is required"),
  rating: z.string().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  image: z.any().optional(),
});

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    contactNo: "",
    address: "",
    nid: "",
    image: null
  });

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [hotelData, setHotelData] = useState({
    name: "",
    description: "",
    location: "",
    rating: "",
    image: null,
  });

  const token = localStorage.getItem('token');

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: errorsUpdate },
    reset: resetDetails,
  } = useForm({ resolver: zodResolver(schemaDetails) });

  const {
    register: registerHotel,
    handleSubmit: handleSubmitHotel,
    formState: { errors: errorsHotel },
    reset: resetHotel,
  } = useForm({ resolver: zodResolver(schemaHotel) });

  // Fetch user details

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          fname: response.data.name.split(" ")[0],
          lname: response.data.name.split(" ")[1] || "",
          email: response.data.email,
          contactNo: response.data.contact_no || "",
          address: response.data.address || "",
          nid: response.data.nid_number || "",
        });
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    if (token) fetchUserDetails();
  }, [token]);


  // Update user details

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDetailsFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, image: e.target.files[0] }));
  };

  const handleDetailsCancel = () => {
    setFormData({
      fname: user.name.split(" ")[0],
      lname: user.name.split(" ")[1] || "",
      email: user.email,
      contactNo: user.contact_no || "",
      address: user.address || "",
      nid: user.nid_number || "",
    });
    setIsEditing(false);
  };

  const handleDetails = async () => {
    const updatedData = new FormData();
    updatedData.append("fname", formData.fname);
    updatedData.append("lname", formData.lname);
    updatedData.append("email", formData.email);
    updatedData.append("contactNo", formData.contactNo);
    updatedData.append("address", formData.address);
    updatedData.append("nid", formData.nid);
    if (formData.image) {
      updatedData.append("image", formData.image);
    }

    try {
      await axios.put('http://127.0.0.1:8000/api/users/update-profile/', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };


  // List hotel

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleHotelFileChange = (e) => {
    setHotelData((prevState) => ({ ...prevState, image: e.target.files[0] }));
  };

  const handleListHotel = async () => {
    const newHotel = new FormData();
    newHotel.append("name", hotelData.name);
    newHotel.append("description", hotelData.description);
    newHotel.append("location", hotelData.location);
    newHotel.append("rating", hotelData.rating);

    if (hotelData.image) {
      newHotel.append("image", hotelData.image);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/hotels/add-hotel/", newHotel, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Hotel listed successfully!");
      setShowHotelForm(false);
      resetHotel();
      setHotelData({
        name: "",
        description: "",
        location: "",
        rating: "",
        image: null,
      });
    } catch (error) {
      toast.error("Error listing hotel.");
    }
  };

  return (
    <div className="mx-10 my-30 p-6 bg-white shadow-lg rounded-lg">
      {user ? (
        <div className="flex justify-between flex-col md:flex-row items-center">
          <form className="flex flex-col sm:flex-row items-center px-5 gap-6">
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-32 h-32 border border-gray-300 rounded-full sm:rounded-none object-cover" />
            ) : (
              <img src="/profile-user.png" alt="Default Profile" className="w-32 h-32 border border-gray-300 rounded-full sm:rounded-none object-cover" />
            )}
            {!isEditing ? (
              <div className='text-center sm:text-left'>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-600"><strong>Contact:</strong> {user.contact_no || "N/A"}</p>
                <p className="text-gray-600"><strong>Address:</strong> {user.address || "N/A"}</p>
                <p className="text-gray-600"><strong>NID:</strong> {user.nid_number || "N/A"}</p>
              </div>
            ) : (
              <div className='text-center space-y-2 sm:text-left w-2/3'>
                <div className="flex gap-5">
                  <div>
                    <input {...registerDetails("fname")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="fname" value={formData.fname} onChange={handleDetailsChange} />
                    {errorsUpdate.fname && <p className="text-red-500">{errorsUpdate.fname.message}</p>}
                  </div>
                  <div>
                    <input {...registerDetails("lname")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="lname" value={formData.lname} onChange={handleDetailsChange} />
                    {errorsUpdate.lname && <p className="text-red-500">{errorsUpdate.lname.message}</p>}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div>
                    <input {...registerDetails("contactNo")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="contactNo" value={formData.contactNo} onChange={handleDetailsChange} />
                    {errorsUpdate.contactNo && <p className="text-red-500">{errorsUpdate.contactNo.message}</p>}
                  </div>  
                  <div>
                    <input {...registerDetails("nid")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="nid" value={formData.nid} onChange={handleDetailsChange} />
                    {errorsUpdate.nid && <p className="text-red-500">{errorsUpdate.nid.message}</p>}
                  </div>  
                </div>
                <div> 
                  <textarea {...registerDetails("address")} rows={2} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="address" value={formData.address} onChange={handleDetailsChange} />
                  {errorsUpdate.address && <p className="text-red-500">{errorsUpdate.address.message}</p>}
                </div>  
                <div>  
                  <input {...registerDetails("image")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleDetailsFileChange} />
                </div>
              </div>
            )}
          </form>

          <div className="flex flex-col sm:flex-row md:flex-col gap-5 mt-7 md:mt-0">
          {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                <IconEdit className='mr-1' /> Update profile
              </button>
            ) : (
              <div className='flex gap-2'>
                <button onClick={handleSubmitDetails(handleDetails)} className="flex items-center justify-center px-4 py-2 bg-green-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                  <IconCheck className='mr-1' /> Save changes
                </button>
                <button onClick={handleDetailsCancel} className="flex items-center justify-center px-4 py-2 bg-red-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                  <IconX />
                </button>
              </div>
            )}
            
            <button onClick={() => setShowHotelForm(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              <IconMapPinPlus className='mr-1' /> List your hotel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">User details not found.</p>
      )}
      {showHotelForm && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center">
          <div className="bg-white p-5 mt-20 rounded-md shadow-lg">
            <form className="space-y-2">
              <div>
                <input {...registerHotel("name")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="name" placeholder="Hotel Name" value={hotelData.name} onChange={handleHotelChange}/>
                {errorsHotel.name && <p className="text-red-500">{errorsHotel.name.message}</p>}
              </div>
              <div>
                <textarea {...registerHotel("description")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" name="description" placeholder="Hotel Description" value={hotelData.description} onChange={handleHotelChange}/>
                {errorsHotel.description && <p className="text-red-500">{errorsHotel.description.message}</p>}
              </div>
              <div>
                <input {...registerHotel("location")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="location" placeholder="Hotel Location" value={hotelData.location} onChange={handleHotelChange}/>
                {errorsHotel.location && <p className="text-red-500">{errorsHotel.location.message}</p>}
              </div>
              <div>
                <input {...registerHotel("rating")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="number" name="rating" placeholder="Hotel Rating" value={hotelData.rating} onChange={handleHotelChange}/>
                {errorsHotel.rating && <p className="text-red-500">{errorsHotel.rating.message}</p>}
              </div>
              <div>
                <input {...registerHotel("image")} className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleHotelFileChange} />
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={handleSubmitHotel(handleListHotel)} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition">
                  Submit
                </button>
                <button onClick={() => setShowHotelForm(false)} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
