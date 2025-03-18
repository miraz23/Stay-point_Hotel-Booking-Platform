import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { IconEdit, IconCheck, IconX, IconMapPinPlus } from '@tabler/icons-react';

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

  const token = localStorage.getItem('token');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCancel = () => {
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

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, image: e.target.files[0] }));
  };

  const handleUpdate = async () => {
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

  return (
    <div className="mx-10 my-25 p-6 bg-white shadow-lg rounded-lg">
      {user ? (
        <div className="flex justify-between flex-col md:flex-row items-center">
          <div className="flex flex-col sm:flex-row items-center px-5 gap-6">
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
              <div className='text-center space-y-2 sm:text-left'>
                <div className="flex gap-5">
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="fname" value={formData.fname} onChange={handleChange} />
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="lname" value={formData.lname} onChange={handleChange} />
                </div>
                <div className="flex gap-5">
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="flex gap-5">  
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" name="nid" value={formData.nid} onChange={handleChange} />
                  <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-5 mt-7 md:mt-0">
          {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                <IconEdit className='mr-1' /> Update profile
              </button>
            ) : (
              <div className='flex gap-2'>
                <button onClick={handleUpdate} className="flex items-center justify-center px-4 py-2 bg-green-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                  <IconCheck className='mr-1' /> Save changes
                </button>
                <button onClick={handleCancel} className="flex items-center justify-center px-4 py-2 bg-red-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
                  <IconX />
                </button>
              </div>
            )}
            
            <button className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              <IconMapPinPlus className='mr-1' /> List your hotel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">User details not found.</p>
      )}
    </div>
  );
}
