import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "react-hot-toast";
import { IconEdit, IconMapPinPlus } from '@tabler/icons-react';

const schema = z.object({
  contact_no: z.string().min(11, "Contact number must be 11 digits").max(11, "Contact number must be 11 digits").regex(/^\d+$/, "Only numbers allowed"),
  nid_number: z.string().min(10, "NID Number must be 10 digits").max(10, "NID Number must be 10 digits").regex(/^\d+$/, "Only numbers allowed"),
  present_address: z.string().min(3, "Present Address is required"),
  permanent_address: z.string().min(3, "Permanent Address is required"),
});

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState('/profile-user.png');
  const token = localStorage.getItem('token');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        if (response.data) {
          setValue("contact_no", response.data.contact_no || "");
          setValue("nid_number", response.data.nid_number || "");
          setValue("present_address", response.data.present_address || "");
          setValue("permanent_address", response.data.permanent_address || "");
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };

    if (token) fetchUserProfile();
  }, [token, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    console.log("Validated Data:", data);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="m-20 lg:m-40">
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div>
          <h1 className='text-4xl font-semibold'>{user.name}</h1>
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div>
          <button className="flex items-center px-6 py-3 my-5 bg-cyan-500 text-white text-[18px] font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            <IconMapPinPlus className='mr-2' /> List your property
          </button>
        </div>
      </div>
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col md:flex-row gap-5 my-6'>
            <div className="relative w-50 md:w-70 mx-auto">
              <img src={image} alt="Profile" className="w-full h-full p-2 border border-gray-300 rounded object-cover" />
              <input  type="file"  accept="image/*"  onChange={handleImageChange}  className="absolute inset-0 opacity-0 cursor-pointer"/>
            </div>

            <div className='w-full flex flex-col gap-5'>
              <div className='flex flex-col md:flex-row gap-5'>
                <div className="w-full">
                  <input type="text" {...register("contact_no")}placeholder="Contact No" className="w-full p-2 border border-gray-300 rounded" />
                  {errors.contact_no && <p className="text-red-500">{errors.contact_no.message}</p>}
                </div>
                <div className="w-full">
                  <input type="text" {...register("nid_number")} placeholder="NID Number" className="w-full p-2 border border-gray-300 rounded" />
                  {errors.nid_number && <p className="text-red-500">{errors.nid_number.message}</p>}
                </div>
              </div>

              <div>
                <textarea rows={2} {...register("present_address")}placeholder="Present Address" className="w-full p-2 border border-gray-300 rounded" />
                {errors.present_address && <p className="text-red-500">{errors.present_address.message}</p>}
              </div>

              <div>
                <textarea rows={2} {...register("permanent_address")}placeholder="Permanent Address" className="w-full p-2 border border-gray-300 rounded" />
                {errors.permanent_address && <p className="text-red-500">{errors.permanent_address.message}</p>}
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="flex items-center px-6 py-3 bg-cyan-500 text-white text-[18px] font-semibold rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              <IconEdit className='mr-2' /> Update Profile
            </button>
          </div>
        </form>
      ) : (
        <p>User details not found.</p>
      )}
    </div>
  );
}