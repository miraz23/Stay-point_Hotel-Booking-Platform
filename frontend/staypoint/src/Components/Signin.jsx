import React from 'react'
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Signin() {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSignin = async () => {
      try {
        await axios.post("http://127.0.0.1:8000/api/users/signin/", {
          fname,
          lname,
          email,
          password,
        });
        toast.success("Check your email for activation link");
      } catch (error) {
        toast.error("Error during registration");
      }
    };
  
    return (
      <div className="flex justify-center mt-20">
        <input type="text" placeholder="First Name" onChange={(e) => setFname(e.target.value)} />
        <input type="text" placeholder="Last Name" onChange={(e) => setLname(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignin}>Signin</button>
      </div>
    );
}
