import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import toast from "react-hot-toast";

const JoinedEventList = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_KEY_BASE_URL}/api/event/events/joined`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setJoinedEvents(data);
      } catch (error) {
        toast.error("Failed to fetch joined events");
        console.error("Error fetching joined events:", error);
      }
    };

    fetchJoinedEvents();
  }, []);

  return (
    <Sidebar>
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Joined Events</h1>

        <div className="bg-white shadow-md rounded-md p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Title</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {joinedEvents.length > 0 ? (
                joinedEvents.map((event) => (
                  <tr key={event._id} className="border-b hover:bg-gray-100">
                    <td className="border p-3">{event.title}</td>
                    <td className="border p-3">{event.date}</td>
                    <td className="border p-3">{event.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No joined events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default JoinedEventList;
