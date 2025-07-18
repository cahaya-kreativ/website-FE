import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

// Icons
import { FaHome, FaBoxOpen } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { IoMdCart, IoMdSettings } from "react-icons/io";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import BrandLogo from "../../img/logogram_hitam.png";

// Redux Action
import { logoutAdminAction } from "../../../redux/action/admin/auth/logoutAdminAction";

export const SidebarAdmin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fungsi cek active route
  const isActive = (path) => {
    return location.pathname === path;
  };

  const auth = useSelector((state) => state.authLoginAdmin.admin);

  const navItems = [
    {
      icon: <FaHome className="h-5 w-5" />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <FiMessageCircle className="h-5 w-5" />,
      label: "Messages",
      path: "/admin/chat",
      role: "admin",
    },
    {
      icon: <IoMdCart className="h-5 w-5" />,
      label: "Order",
      path: "/admin/orders",
    },
    {
      icon: <FaBoxOpen className="h-5 w-5" />,
      label: "Product",
      path: "/admin/products",
    },
    {
      icon: <HiUsers className="h-5 w-5" />,
      label: "Customers",
      path: "/admin/customers",
    },
    {
      icon: <MdOutlinePermMedia className="h-5 w-5" />,
      label: "Gallery",
      path: "/admin/gallery",
    },
    {
      icon: <RiCalendarScheduleFill className="h-5 w-5" />,
      label: "Schedule",
      path: "/admin/schedule",
    },
    {
      icon: <IoMdSettings className="h-5 w-5" />,
      label: "Settings",
      path: "/admin/setting",
    },
  ];

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutAdminAction());
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`bg-opacity-50 fixed inset-0 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-40 h-full w-72 transform transition-transform duration-300 ease-in-out md:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col bg-zinc-800 p-4`}
      >
        <button
          onClick={onClose}
          className="absolute top-9 right-4 text-zinc-400 hover:text-zinc-200 md:hidden"
        ></button>

        {/* Logo */}
        <div className="flex items-center gap-4 border-b border-zinc-900 px-2 py-4.5">
          <img
            src={BrandLogo}
            alt="Brand Logo"
            className="hidden w-[1.5rem] md:block"
          />
          <h1 className="font-serif text-xl font-bold text-white">
            Hi, {auth?.fullname}
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-4 pt-4">
          {navItems.map((item, index) => {
            if (item.role && item.role !== auth?.role) return null;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex w-full cursor-pointer items-center space-x-3 rounded-lg px-4 py-2 transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="">
          <button
            className="flex w-full cursor-pointer items-center space-x-3 rounded-lg border-t border-zinc-900 px-4 py-2 text-gray-300 hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LuLogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

SidebarAdmin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
