import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaListAlt } from "react-icons/fa";
import { FaPlaneDeparture } from "react-icons/fa6"; // Ikon cuti

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";
import { AddEmployee } from "./AddEmployee";
import { ChangedPassword } from "./ChangedPassword";
import { ListEmployee } from "./ListEmployee";
import { PengajuanCuti } from "./PengajuanCuti";

export const Setting = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useSelector((state) => state.authLoginAdmin.admin);

  // Tentukan default tab berdasarkan role
  const defaultTab = auth?.role === "admin" ? "list-employee" : "change-password";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");

    const adminTabs = ["list-employee", "add-employee", "change-password"];
    const employeeTabs = ["change-password", "pengajuan-cuti"];

    if (auth?.role === "admin" && adminTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (auth?.role !== "admin" && employeeTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab(defaultTab);
    }
  }, [location, auth, defaultTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-900">
      {/* Sidebar Mobile Toggle */}
      <button
        className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-200 shadow-md md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <CiMenuBurger className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <SidebarAdmin isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
          </div>

          <div className="flex gap-4">
            {/* Menu Sidebar */}
            <div className="w-[30%] rounded-lg bg-zinc-800 p-4">
              <h2 className="mb-4 flex items-center gap-4 border-b border-zinc-900 px-4 py-2 text-lg font-semibold text-white">
                <IoMdSettings size={20} />
                Pengaturan
              </h2>
              <ul className="space-y-4">
                {auth?.role === "admin" && (
                  <>
                    <li>
                      <button
                        onClick={() => setActiveTab("list-employee")}
                        className={`flex w-full items-center gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                          activeTab === "list-employee"
                            ? "bg-blue-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        }`}
                      >
                        <FaListAlt size={20} />
                        Daftar List Karyawan
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("add-employee")}
                        className={`flex w-full items-center gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                          activeTab === "add-employee"
                            ? "bg-blue-600 text-white"
                            : "text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                        }`}
                      >
                        <IoPersonAdd size={20} />
                        Tambah Karyawan
                      </button>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={() => setActiveTab("change-password")}
                    className={`flex w-full items-center gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                      activeTab === "change-password"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                    }`}
                  >
                    <TbLockPassword size={20} />
                    Ganti Kata Sandi
                  </button>
                </li>

                {auth?.role !== "admin" && (
                  <li>
                    <button
                      onClick={() => setActiveTab("pengajuan-cuti")}
                      className={`flex w-full items-center gap-4 rounded px-4 py-2 text-left text-sm transition-all ${
                        activeTab === "pengajuan-cuti"
                          ? "bg-blue-600 text-white"
                          : "text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                      }`}
                    >
                      <FaPlaneDeparture size={18} />
                      Pengajuan Cuti
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Dynamic Content */}
            <div className="w-[70%] rounded-lg bg-zinc-800 p-6">
              {auth?.role === "admin" && activeTab === "list-employee" && (
                <ListEmployee />
              )}
              {auth?.role === "admin" && activeTab === "add-employee" && (
                <AddEmployee />
              )}
              {activeTab === "change-password" && <ChangedPassword />}
              {auth?.role !== "admin" && activeTab === "pengajuan-cuti" && (
                <PengajuanCuti />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
