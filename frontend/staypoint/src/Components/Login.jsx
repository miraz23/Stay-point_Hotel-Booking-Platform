import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        username: email,
        password: password,
      });
  
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      toast.success("Logged in successfully");
  
      window.location.href = "/";
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };
  

  return (
    <div className="flex justify-center mt-20">
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
