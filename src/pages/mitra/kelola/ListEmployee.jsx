import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getEmployeesAction } from "../../../redux/action/admin/dashboard/GetCustomersAction";

export const ListEmployee = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const employeesPerPage = 10;

  // Ambil data dari Redux Store
  const employees = useSelector((state) => state.getCustomer.employees || []);

  // Filter employees berdasarkan nama lengkap
  const filteredEmployees = employees.filter((employee) =>
    employee.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    dispatch(getEmployeesAction());
  }, [dispatch]);

  return (
    <div className="text-white">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">List Karyawan</h2>
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[40%] rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700 bg-zinc-900">
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">
                  {searchTerm
                    ? `Tidak ditemukan karyawan bernama "${searchTerm}"`
                    : "Belum ada data karyawan"}
                </td>
              </tr>
            ) : (
              currentEmployees.map((Employee, index) => (
                <tr
                  key={Employee.id}
                  className="transition-colors hover:bg-zinc-800"
                >
                  <td className="px-4 py-3 text-center text-gray-300">{index + 1}</td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.fullname}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">{Employee.email}</td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.phoneNumber || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {indexOfFirstEmployee + 1} to{" "}
          {Math.min(indexOfLastEmployee, filteredEmployees.length)} of{" "}
          {filteredEmployees.length} employees
        </p>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className="relative inline-flex cursor-pointer items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50"
          >
            Prev
          </button>
          {[
            ...Array(Math.ceil(filteredEmployees.length / employeesPerPage)),
          ].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`${
                currentPage === i + 1
                  ? "bg-zinc-800 text-white"
                  : "text-gray-400 hover:bg-zinc-800 hover:text-white"
              } relative -ml-px inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium ring-1 ring-zinc-700 ring-inset`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={
              currentPage ===
              Math.ceil(filteredEmployees.length / employeesPerPage)
            }
            onClick={() => paginate(currentPage + 1)}
            className="relative inline-flex cursor-pointer items-center rounded-r-md px-3 py-2 text-sm font-medium text-gray-500 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};
