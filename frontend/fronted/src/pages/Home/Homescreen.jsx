import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { FaCalendarAlt, FaFilter, FaUserCheck } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const Homescreen = () => {
  const socket = useSocket();
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const authToken = localStorage.getItem("authToken"); 

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_KEY_BASE_URL}/api/event/events`
        );
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newEvent", (newEvent) => {
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
      toast.success(`New Event Added: ${newEvent.title}`);
    });

    socket.on("eventUpdated", (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
      toast.success(`Someone joined: ${updatedEvent.title}`);
    });

    return () => {
      socket.off("newEvent");
      socket.off("eventUpdated");
    };
  }, [socket]);

  const filteredEvents = events.filter((event) => {
    return (
      (category === "" || event.category === category) &&
      (date === "" || event.date === date)
    );
  });

  const upcomingEvents = filteredEvents.filter((event) => event.date >= today);
  const pastEvents = filteredEvents.filter((event) => event.date < today);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_KEY_BASE_URL}/api/event/events/${eventId}/attend`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success(`Joined event: ${data.title}`);
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event. Try again!");
    }
  };

  return (
    <Sidebar>
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Event Dashboard
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6 bg-white p-4 shadow-md rounded-md">
          <select
            className="border p-2 rounded-md w-1/3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Gaming">Gaming</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded-md w-1/3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => {
              setCategory("");
              setDate("");
            }}
          >
            <FaFilter className="mr-2" />
            Reset Filters
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white p-4 shadow-md rounded-md">
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <p className="text-gray-600">{event.date}</p>
                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                    {event.category}
                  </span>
                  <p className="text-gray-700 mt-2 flex items-center">
                    <FaUserCheck className="text-green-600 mr-2" />
                    {event.attendees.length} attendees
                  </p>
                  <button
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md w-full"
                    onClick={() => handleJoinEvent(event._id)}
                  >
                    Join Event
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events found.</p>
            )}
          </div>
        </div>

        {/* Event Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="bg-white p-6 rounded-md shadow-lg w-96 mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          {selectedEvent && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
              <p className="text-gray-700 mb-2">Date: {selectedEvent.date}</p>
              <p className="text-gray-700 mb-4">Category: {selectedEvent.category}</p>
              <p className="text-gray-700 mb-4">
                Attendees: {selectedEvent.attendees.length}
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full" onClick={() => handleJoinEvent(selectedEvent._id)}>
                Join Event
              </button>
            </div>
          )}
        </Modal>
      </div>
    </Sidebar>
  );
};

export default Homescreen;
