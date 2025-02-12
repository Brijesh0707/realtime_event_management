import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from '../../assets/login.webp';
import Logo from "../../assets/react.svg";
import { loginUser } from "../../service/auth.service";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);
      localStorage.setItem("authToken", data.token); 
      navigate("/"); 
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex h-screen">
      <div className="w-1/2 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="px-8 py-6 w-[400px] rounded-lg shadow-lg border border-gray-200">
          <img src={Logo} alt="Inkprint Logo" className="w-[50px] h-[50px] mb-4" /> 
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-6">Welcome back! Fill the below form to sign in.</p>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

 
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md mt-1 focus:ring focus:ring-blue-200"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Password</label>
          <div className="relative">
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md mt-1 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className='py-2'>
            <Link to="/register" className="text-sm text-blue-500 hover:underline">
              No account? Register
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <img src={Image} className="w-full h-full object-cover rounded-tl-[20px] rounded-bl-[20px]" alt="Background" />
      </div>
    </section>
  );
};

export default Login;
