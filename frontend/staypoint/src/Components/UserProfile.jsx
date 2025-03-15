import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { IconMapPinPlus } from '@tabler/icons-react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };

    if(token) {
      fetchUserProfile();
    }
  }, [token]);

  return (
    <div className="h-screen my-25 mx-10">
      {user ? (
        <div className='flex justify-between items-center px-5'>
            <div>
                <h1 className='text-4xl font-semibold'>{user.name}</h1>
                <span className="text-gray-600">{user.email}</span>
            </div>
            <div>
                <button class="flex items-center px-6 py-3 bg-cyan-500 text-white text-[18px] font-semibold rounded-2xl shadow-md hover:bg-cyan-600 transition cursor-pointer">
                    <IconMapPinPlus className='mr-2' /> List your property
                </button>
            </div>
        </div>
      ) : (
        <p>User details not found.</p>
      )}
    </div>
  );
}