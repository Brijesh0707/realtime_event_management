import axios from "axios";

const BASE_URL = import.meta.env.VITE_KEY_BASE_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, userData);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
