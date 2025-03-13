import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../actions/userActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors }} = useForm({ resolver: zodResolver(loginSchema) });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, userInfo, error } = useSelector((state) => state.userLogin);
  
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleLogin = (data) => {
    dispatch(login(data.email, data.password));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-[30px] cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
            STAY POINT
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-3">Welcome back</h2>
          <p className="mt-2 text-md text-gray-600">Please log in to your account</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col space-y-2">
            <input className="block w-full rounded-lg border border-gray-300 px-4 py-2" type="email" placeholder="Email" {...register("email")}/>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <input className="block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10" type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")}/>
            <button type="button" className="absolute right-3 top-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <i className="bi bi-eye-slash cursor-pointer"></i> : <i className="bi bi-eye cursor-pointer"></i>}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-cyan-500 hover:text-cyan-800">Forgot password?</a>
          </div>

          <button className="w-full px-4 py-2 text-sm rounded-lg shadow-sm transition-all duration-500 ease-in-out hover:opacity-90 cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-800" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link className="text-cyan-500 text-md transition-all duration-500 ease-in-out hover:text-cyan-800 cursor-pointer" to="/auth/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}