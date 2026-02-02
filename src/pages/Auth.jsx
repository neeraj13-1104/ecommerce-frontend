import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        onLogin(); // update App.jsx state
        navigate("/header"); // redirect after login
      } else {
        // SIGNUP
        await axios.post("http://localhost:5000/api/auth/signup", form);
        alert("Signup successful! Please login");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            className="w-full mb-3 p-2 border rounded"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />
        {/* Forgot password */}
{isLogin && (
  <p
    className="text-right text-sm text-purple-600 cursor-pointer mb-3"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </p>
)}


        <button className="w-full bg-purple-600 text-white py-2 rounded mb-3">
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span
            className="text-purple-600 cursor-pointer font-semibold"
            onClick={() => {
              setIsLogin(!isLogin);
              setForm({ name: "", email: "", password: "" });
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
