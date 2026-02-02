import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      alert("Reset link sent to your email");
      navigate("/auth");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-purple-600 text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
