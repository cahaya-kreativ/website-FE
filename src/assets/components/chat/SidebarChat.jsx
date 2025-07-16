import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

// Icons
import { FaHome } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import BrandLogo from "../../img/logogram_hitam.png";

// Redux Action
import { getUserProfileAction } from "../../../redux/action/user/profile/profileUserAction";

export const SidebarChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.authLogin.userProfile);
  const profile = useSelector((state) => state.authLogin.user);

  const navItems = [
    {
      icon: <FaHome className="h-5 w-5" />,
      label: "Dashboard",
      active: false,
      onClick: () => navigate("/"),
    },
    {
      icon: <FiMessageCircle className="h-5 w-5" />,
      label: "Messages",
      active: true,
      onClick: () => navigate("/chat"),
    },
    {
      icon: <MdOutlinePermMedia className="h-5 w-5" />,
      label: "Gallery",
      active: false,
      onClick: () => navigate("/gallery"),
    },
    {
      icon: <AiOutlineProduct className="h-5 w-5" />,
      label: "Product",
      active: false,
      onClick: () => navigate("/products"),
    },
  ];

  useEffect(() => {
    dispatch(getUserProfileAction()); // Fetch user profile on component mount
  }, [dispatch]);

  // Function to get initials from the user's full name
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const initials = names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
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
        className={`fixed z-40 h-full w-64 md:w-80 transform transition-transform duration-300 ease-in-out md:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col bg-zinc-800 p-4`}
      >
        <button
          onClick={onClose}
          className="absolute top-9 right-4 text-zinc-400 hover:text-zinc-200 md:hidden"
        ></button>

        {/* Logo */}
        <div className="flex items-center border-b border-zinc-900 px-2 py-4.5 gap-2">
        <img src={BrandLogo} alt="Brand Logo" className="w-[1.5rem] hidden md:block" />
          <h1 className="font-serif text-2xl font-bold text-white">
            Cahaya Kreativ
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-4 pt-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex w-full cursor-pointer items-center space-x-3 rounded-lg px-4 py-2 transition-colors ${
                item.active
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-4">
          <button
            className="flex w-full cursor-pointer items-center space-x-3 rounded-lg border-t border-zinc-900 px-2 py-3 text-gray-300 hover:bg-gray-700"
            onClick={() => navigate("/profile-user")}
          >
            {userProfile?.avatar_url ? (
              <img
                src={userProfile.avatar_url}
                alt="User Avatar"
                className="h-8 w-10 rounded-full border-2 border-blue-500"
              />
            ) : (
              <div className="flex h-8 w-10 items-center justify-center rounded-full bg-white text-lg text-black">
                {getInitials(profile?.fullname || "")}
              </div>
            )}
            <span className="w-full truncate text-left font-medium">
              {profile?.fullname || "Profile"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

SidebarChat.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
