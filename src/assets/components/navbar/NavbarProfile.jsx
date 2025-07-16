import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Icons
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import BrandLogo from "../../img/logogram_hitam.png";

// Redux Actions
import { logoutAction } from "../../../redux/action/user/auth/logoutAction";
import { getNotificationsAction } from "../../../redux/action/user/notification/getNotificationsAction";

export const NavbarProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      const result = await dispatch(getNotificationsAction());
      if (result && result.unreadCount !== undefined) {
        setUnreadNotificationsCount(result.unreadCount);
      }
    };

    fetchNotificationsCount();
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <div className="fixed top-0 z-25 flex w-screen items-center justify-between bg-zinc-900 px-6 py-6 md:px-14 lg:px-28">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/")}
      >
        <img src={BrandLogo} alt="Brand Logo" className="w-[1.8rem]" />
        <div className="font-serif text-2xl font-semibold text-white md:text-3xl">
          Cahaya Kreativ
        </div>
      </div>

      <div className="flex gap-4 text-base text-white md:flex lg:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <IoNotifications size={30} className="hover:text-amber-400"/>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div className="cursor-pointer" onClick={toggleSidebar}>
          <AiOutlineMenu size={30} />
        </div>
      </div>

      <div className="hidden items-center gap-4 text-white md:hidden md:gap-8 lg:flex lg:gap-8">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <IoNotifications size={30} className="hover:text-amber-400"/>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div className="flex cursor-pointer rounded-xl bg-white px-2 py-1 font-bold text-zinc-900 md:gap-4 md:px-6 lg:gap-2 lg:px-6">
          <FaUser size={30} />
          <div className="text-lg">Profile</div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black/50"
          onClick={toggleSidebar}
        >
          <div className="fixed top-0 right-0 h-full w-64 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between pb-4">
              <div className="font-serif text-3xl font-semibold">
                Cahaya Kreativ
              </div>
              <button
                onClick={toggleSidebar}
                className="rounded-md border p-2 shadow-xl"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6 py-4">
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/profile-user")}
              >
                Profile
              </span>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/password-user")}
              >
                Ubah Password
              </span>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/history")}
              >
                Riwayat Pemesanan
              </span>
              <div className="flex items-center gap-3" onClick={handleLogout}>
                <LuLogOut size={25} />
                <span className="cursor-pointer text-xl font-bold hover:text-amber-400">
                  Logout
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
