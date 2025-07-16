import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// icons
import { LuPenLine } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

// Redux Actions
import { logoutAction } from "../../../redux/action/user/auth/logoutAction";

export const SidebarAkun = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    // Sidebar Container
    <div className="hidden w-[40%] flex-col px-4 md:flex lg:flex">
      {/* Sidebar Item */}
      <div
        className="flex cursor-pointer items-center gap-3 border-b-2 border-zinc-900 py-4 transition-transform duration-300 hover:scale-105 hover:text-amber-500"
        onClick={() => {
          navigate("/profile-user");
        }}
      >
        <div className="text-amber-500">
          <LuPenLine size={25} />
        </div>
        <div className="text-md font-semibold text-white">Profile Saya</div>
      </div>
      {/* Sidebar Item */}
      <div
        className="flex cursor-pointer items-center gap-3 border-b-2 border-zinc-900 py-4 transition-transform duration-300 hover:scale-105 hover:text-amber-500"
        onClick={() => {
          navigate("/password-user");
        }}
      >
        <div className="text-amber-500">
          <IoSettingsOutline size={25} />
        </div>
        <div className="text-md font-semibold text-white">Ubah Password</div>
      </div>
      {/* Sidebar Item */}
      <div
        className="flex cursor-pointer items-center gap-3 border-b-2 border-zinc-900 py-4 transition-transform duration-300 hover:scale-105 hover:text-amber-500"
        onClick={() => {
          navigate("/history");
        }}
      >
        <div className="text-amber-500">
          <MdOutlineShoppingCart size={25} />
        </div>
        <div className="text-md font-semibold text-white">
          Riwayat Pemesanan
        </div>
      </div>
      {/* Sidebar Item */}
      <div
        className="flex cursor-pointer items-center gap-3 border-b-2 border-zinc-900 py-4 transition-transform duration-300 hover:scale-105 hover:text-amber-500"
        onClick={handleLogout}
      >
        <div className="text-amber-500">
          <LuLogOut size={25} />
        </div>
        <div className="text-md font-semibold text-white">Keluar</div>
      </div>
    </div>
  );
};
