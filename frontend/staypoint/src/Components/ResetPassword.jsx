import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../actions/userActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function ResetPassword() {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.userResetPassword);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors },} = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const handleResetPassword = (data) => {
    dispatch(resetPassword(uid, token, data.password));
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(handleResetPassword)}>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10" placeholder="Enter new password" {...register("password")}/>
            <button type="button" className="absolute right-3 top-3 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IconEyeClosed /> : <IconEye />}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full px-4 py-2 text-sm rounded-lg shadow-sm transition-all duration-500 ease-in-out hover:opacity-90 cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-800" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
