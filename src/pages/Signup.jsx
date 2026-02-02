import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful, now login");
      navigate("/login"); // ✅ FIX
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input name="name" placeholder="Name" className="w-full mb-3 p-2 border rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" onChange={handleChange} />

        <button className="w-full bg-purple-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
