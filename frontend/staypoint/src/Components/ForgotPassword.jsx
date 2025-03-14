import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../actions/userActions";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.userForgotPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center">Enter your email to reset your password</p>

        <form className="mt-4" onSubmit={handleSubmit}>
          <input type="email" className="w-full rounded-lg border border-gray-300 px-4 py-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <button type="submit" className="mt-4 w-full px-4 py-2 text-sm rounded-lg shadow-sm transition-all duration-500 ease-in-out hover:opacity-90 cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-800" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}