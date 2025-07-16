import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaListAlt } from "react-icons/fa";

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";
import { AddEmployee } from "../kelola/AddEmployee";
import { ChangedPassword } from "../kelola/ChangedPassword";
import { ListEmployee } from "../kelola/ListEmployee";

export const Setting = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list-employee");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");

    if (
      ["list-employee", "add-employee", "change-password"].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-900">
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-200 shadow-md md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <CiMenuBurger className="h-5 w-5" />
      </button>

      {/* Main Sidebar Admin */}
      <SidebarAdmin isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
          </div>

          {/* Two Columns Layout */}
          <div className="flex gap-4">
            {/* Sidebar Menu Kiri */}
            <div className="w-[30%] rounded-lg bg-zinc-800 p-4">
              <h2 className="mb-4 flex items-center gap-4 border-b border-zinc-900 px-4 py-2 text-lg font-semibold text-white">
                <IoMdSettings size={20} />
                Pengaturan
              </h2>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActiveTab("list-employee")}
                    className={`flex w-full cursor-pointer gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                      activeTab === "list-employee"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <FaListAlt size={20} />
                    Daftar List Karyawan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("add-employee")}
                    className={`flex w-full cursor-pointer gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                      activeTab === "add-employee"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <IoPersonAdd size={20} />
                    Tambah Karyawan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("change-password")}
                    className={`flex w-full cursor-pointer gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                      activeTab === "change-password"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <TbLockPassword size={20} />
                    Ganti Kata Sandi
                  </button>
                </li>
              </ul>
            </div>

            {/* Konten Dinamis Kanan */}
            <div className="w-[70%] rounded-lg bg-zinc-800 p-6">
              {activeTab === "list-employee" && <ListEmployee />}
              {activeTab === "add-employee" && <AddEmployee />}
              {activeTab === "change-password" && <ChangedPassword />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
