import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";

// Redux Action
import { getCustomersAction } from "../../../redux/action/admin/dashboard/GetCustomersAction";
import { getChatAdminAction } from "../../../redux/action/admin/chat/chatAdminAction";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { BsChatDotsFill } from "react-icons/bs";

export const KelolaUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Ambil data dari Redux Store
  const customers = useSelector((state) => state.getCustomer.customers || []);
  const auth = useSelector((state) => state.authLoginAdmin.admin);

  // Filter customers berdasarkan nama lengkap
  const filteredCustomers = customers.filter((customer) =>
    customer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const getPaginationGroup = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return new Array(end - start + 1).fill(null).map((_, idx) => start + idx);
  };

  useEffect(() => {
    dispatch(getCustomersAction());
  }, [dispatch]);

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

      {/* Sidebar */}
      <SidebarAdmin isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Kelola Pengguna</h1>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[40%] rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Table of Users */}
          <div className="overflow-x-auto rounded-lg border border-zinc-700 shadow-md">
            <table className="min-w-full table-auto divide-y divide-zinc-700 text-xs sm:text-sm">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="min-w-[40px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    NO
                  </th>
                  <th className="min-w-[160px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    NAMA LENGKAP
                  </th>
                  <th className="min-w-[160px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    EMAIL
                  </th>
                  <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    TELEPON
                  </th>
                  <th className="min-w-[160px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    ALAMAT
                  </th>
                  <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    KOTA
                  </th>
                  <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    PROVINSI
                  </th>
                  {auth?.role === "admin" && (
                    <th className="min-w-[80px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                      ACTION
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700 bg-zinc-900">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-400">
                      {searchTerm
                        ? `Tidak ditemukan pengguna bernama "${searchTerm}"`
                        : "Belum ada data pengguna"}
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-zinc-800"
                    >
                      <td className="px-4 py-3 text-center text-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {customer.fullname}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {customer.email}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {customer.phoneNumber || "-"}
                      </td>
                      <td className="max-w-xs px-4 py-3 whitespace-normal text-gray-300">
                        {customer.profile?.address || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {customer.profile?.city || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {customer.profile?.province || "-"}
                      </td>
                      {auth?.role === "admin" && (
                        <td className="px-4 py-3 text-center text-white">
                          <BsChatDotsFill
                            className="ml-4 cursor-pointer"
                            size={20}
                            onClick={() => {
                              dispatch(getChatAdminAction(customer.id));
                              navigate("/admin/chat");
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {indexOfFirstCustomer + 1} to{" "}
              {Math.min(indexOfLastCustomer, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} users
            </p>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="relative inline-flex cursor-pointer items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50"
              >
                Prev
              </button>

              {/* Render pagination group */}
              {getPaginationGroup().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`${
                    currentPage === pageNumber
                      ? "bg-zinc-800 text-white"
                      : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                  } relative -ml-px inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium ring-1 ring-zinc-700 ring-inset`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="relative inline-flex cursor-pointer items-center rounded-r-md px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
};
