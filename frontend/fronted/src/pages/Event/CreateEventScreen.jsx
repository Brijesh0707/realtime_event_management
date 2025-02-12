import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";


const CreateEventScreen = () => {
  const socket = useSocket(); 

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const authToken = localStorage.getItem("authToken"); 
  
      if (!authToken) {
        toast.error("Unauthorized! Please log in.");
        setLoading(false);
        return;
      }
  
      const { data } = await axios.post(
        `${import.meta.env.VITE_KEY_BASE_URL}/api/event/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (socket) {
        socket.emit("newEvent", data);
      }
  
      toast.success("Event created successfully!");
      setEventData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Try again!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Sidebar>
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Event</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-md rounded-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Gaming">Gaming</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default CreateEventScreen;
