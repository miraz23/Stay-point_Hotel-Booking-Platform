import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { IconEdit, IconCheck, IconX, IconMapPinPlus } from '@tabler/icons-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listHotels } from '../actions/hotelActions';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import Message from './Message';

const schemaDetails = z.object({
  fname: z.string().min(2, "First name must be at least 2 characters"),
  lname: z.string().min(2, "Last name must be at least 2 characters"),
  contactNo: z.string().min(11, "Contact number must be 11 digits"),
  address: z.string().min(3, "Address is required"),
  nid: z.string().min(10, "NID must be 10 characters"),
});

export default function UserProfile() {
  const navigate = useNavigate();
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

  const token = localStorage.getItem('token');

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: errorsUpdate },
    reset: resetDetails,
  } = useForm({ resolver: zodResolver(schemaDetails) });

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

  // Showing listed hotels on profile
  const dispatch = useDispatch();
  const hotelsList = useSelector(state => state.hotelsList);
  const { hotels } = hotelsList;

  useEffect(() => {
    dispatch(listHotels());
  }, [dispatch]);

  return (
    <div className='mx-10 my-30'>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {user ? (
          <div className="flex justify-between flex-col md:flex-row items-center">
            <form className="flex flex-col sm:flex-row items-center gap-6">
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

              <button onClick={() => navigate('/list-hotel')} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                <IconMapPinPlus className="mr-1" /> List your hotel
              </button>
            </div>
          </div>
        ) : (
          <p className="w-full text-lg text-gray-600 text-center italic">User details not found.</p>
        )}
      </div>

      <div className='hotel pt-10'>
        <h1 className='text-4xl text-gray-800 py-4'>Your <span className='text-cyan-600'>Listed Hotels</span></h1>
        <div className="w-full flex flex-wrap gap-4">
          {hotels
              .filter(hotel => hotel.user === user?.id)
              .map(hotel => (
                <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-12px)] flex flex-col border-2 border-[#fff] rounded-xl p-4 bg-white shadow-2xl" key={hotel.id}>
                  <div className="flex flex-col justify-center items-center mb-4">
                    <div className="aspect-[3/2] flex items-center justify-center rounded-xl">
                      {hotel.image ? (
                        <img className="w-full h-full object-cover rounded-xl" src={`http://127.0.0.1:8000${hotel.image}`} alt="Hotel Logo" />
                      ) : (
                        <img className="w-full h-full object-cover rounded-xl" src="/default-hotel.jpg" alt="Hotel Logo" />
                      )}
                    </div>
                    <div className="text-center pt-3">
                      <h1 className="text-xl font-bold text-gray-800">{hotel.name}</h1>
                    </div>
                  </div>
                  <div className="flex justify-between mb-5">
                    <div className="flex items-center">
                      <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                      <span className="text-gray-600">{hotel.location}</span>
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-gray-600 font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                  <Link to={`/hotels/${hotel.id}`}>
                    <button className="w-full px-6 py-2 text-white text-md font-semibold rounded-lg shadow-md bg-cyan-500 hover:opacity-90 transition cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              ))
          }
        </div>
      </div>

    </div>
  );
}
