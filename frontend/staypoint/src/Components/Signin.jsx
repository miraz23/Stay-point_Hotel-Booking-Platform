import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { IconShieldCheck, IconDeviceDesktop, IconRocket, IconEye, IconEyeClosed } from '@tabler/icons-react';

const features = [
  {
    Icon: IconShieldCheck,
    title: "Secure & Reliable Bookings",
    description: "Book with confidence, your data and payments are fully protected.",
  },
  {
    Icon: IconDeviceDesktop,
    title: "Seamless Cross-Platform Access",
    description: "Find and book stays effortlessly on any device, anytime.",
  },
  {
    Icon: IconRocket,
    title: "Fast & Easy Reservations",
    description: "Instant booking confirmation for a hassle-free experience.",
  },
];

const schema = z
  .object({
    fname: z.string().min(2, "First name must be at least 2 characters"),
    lname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export default function Signin() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userSignin = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = userSignin;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleSignin = (data) => {
    dispatch(signin(data.fname, data.lname, data.email, data.password));
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-indigo-50 p-12 flex flex-col justify-center">
        <div className="flex items-center mb-5">
          <h1 className="text-[30px] line-clamp-2 cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
            STAY POINT
          </h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Book Your Perfect Stay</h2>
        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.Icon size={20} className="text-cyan-500" />
              </div>
              <div>
                <h2 type={6} className="font-semibold mb-1">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-12 mx-auto">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <h2 className="mt-2 text-md text-gray-600">Find thousands of hotels already using Stay Point</h2>
          </div>
          
          {error && <p className="text-red-500 text-center pb-5">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit(handleSignin)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" placeholder="First Name" {...register("fname")} />
                {errors.fname && <p className="text-red-500">{errors.fname.message}</p>}
              </div>
              <div>
                <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="text" placeholder="Last Name" {...register("lname")} />
                {errors.lname && <p className="text-red-500">{errors.lname.message}</p>}
              </div>
            </div>
            <div>
              <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="email" placeholder="Email" {...register("email")} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <div className="relative">
                <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")} />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IconEyeClosed /> : <IconEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <div className="relative">
                <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" {...register("confirmPassword")} />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <IconEyeClosed /> : <IconEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-center">
              <input className="rounded-lg border border-gray-300 px-4 py-2 h-4 w-4" type="checkbox" id="terms"/>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#">Terms</a> and{" "}
                <a href="#" className="text-cyan-500 transition-all duration-500 ease-in-out hover:text-cyan-800 cursor-pointer">Privacy Policy</a>
              </label>
            </div>
            <button className="w-full px-4 py-2 text-sm rounded-lg shadow-sm transition-all duration-500 ease-in-out hover:opacity-90 cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-800" type="submit"  disabled={loading}> 
              {loading ? "Signing up..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <a className="text-cyan-500 text-md transition-all duration-500 ease-in-out hover:text-cyan-800 cursor-pointer" href="/auth/login"> Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
