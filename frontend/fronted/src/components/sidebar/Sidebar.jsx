import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChartBar, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import Logo from "../../assets/react.svg"

const Sidebar = ({ children }) => {
  const isGuest = localStorage.getItem("isGuest")
  return (
    <div className="flex h-screen">
 
      <aside className="w-64 bg-white shadow-lg flex flex-col px-2">
     
        <div className="p-4 flex items-center justify-center">
          <img src={Logo} alt="Logo" className="h-[50px] w-[50px]" />
        </div>

        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <FaHome className="mr-2" />
                Home
              </Link>
            </li>
            {isGuest!=="true"?<><li>
              <Link
                to="/event/create"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <FaChartBar className="mr-2" />
                Create Events
              </Link>
            </li>
            <li>
              <Link
                to="/event/join/list"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <FaChartBar className="mr-2" />
                Joined Events
              </Link>
            </li></>:<p className="text-gray-400">Please Create Account to Access the Create Event and Joined Events Thanks</p>

            }
            
          </ul>
        </nav>


        <div className="p-4 border-t">
          <div className="flex items-center space-x-2 justify-center">
            <FaUser className="text-gray-500" size={20} />
            
          </div>
          <button onClick={()=>{
            localStorage.removeItem("authToken")
            localStorage.removeItem("isGuest")
            window.location.reload()
          }} className="w-full flex items-center mt-4 text-red-500 hover:text-red-600">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
};

export default Sidebar;
