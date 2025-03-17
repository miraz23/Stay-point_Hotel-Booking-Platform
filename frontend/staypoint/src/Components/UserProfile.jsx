import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { IconEdit, IconMapPinPlus } from '@tabler/icons-react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    if (token) fetchUserDetails();
  }, [token]);

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
            <div className='text-center sm:text-left'>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-600"><strong>Contact:</strong> {user.contact_no || "N/A"}</p>
              <p className="text-gray-600"><strong>Address:</strong> {user.address || "Not Provided"}</p>
              <p className="text-gray-600"><strong>NID:</strong> {user.nid_number || "Not Provided"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 mt-7 md:mt-0">
            <button className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white  font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              <IconEdit className='mr-1' /> Update profile
            </button>
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
