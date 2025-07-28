import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

import { getEmployeesAction } from "../../../redux/action/admin/dashboard/GetCustomersAction";
import {
  updateEmployeeAction,
  deleteEmployeeAction,
} from "../../../redux/action/admin/auth/addEmployeeAction";

export const ListEmployee = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editTargetId, setEditTargetId] = useState(null);
  const employeesPerPage = 10;
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const openEditModal = (id) => {
    setEditTargetId(id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditTargetId(null);
    setShowEditModal(false);
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setShowDeleteModal(false);
  };

  // Ambil data dari Redux Store
  const employees = useSelector((state) => state.getCustomer.employees || []);
  const auth = useSelector((state) => state.authLoginAdmin.admin);

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

  // Fungsi Edit - placeholder
  const handleEdit = async (req, res, next) => {
    const employeeId = editTargetId;

    const loadingToastId = showLoadingToast("Loading ...");

    try {
      const result = await dispatch(
        updateEmployeeAction(employeeId, {
          fullname: editData.fullname,
          email: editData.email,
          phoneNumber: editData.phoneNumber,
          role: editData.role,
        }),
      );
      toast.dismiss(loadingToastId);

      if (result) {
        showSuccessToast("Edit Employee Successfully!");
        setTimeout(() => {
          dispatch(getEmployeesAction());
          closeEditModal();
        }, 1000);
      }
    } catch (error) {
      next(error);
    }
  };

  // Fungsi Delete - bisa dihubungkan ke Redux action
  const handleDelete = async (req, res, next) => {
    const employeeId = deleteTargetId;

    const loadingToastId = showLoadingToast("Loading ...");

    try {
      const result = await dispatch(deleteEmployeeAction(employeeId));
      toast.dismiss(loadingToastId);

      if (result) {
        setTimeout(() => {
          dispatch(getEmployeesAction());
          closeDeleteModal();
        }, 1000);
      }
    } catch (error) {
      next(error);
    }
  };

  useEffect(() => {
    if (editTargetId) {
      const targetEmployee = employees.find((emp) => emp.id === editTargetId);
      if (targetEmployee) {
        setEditData({
          fullname: targetEmployee.fullname || "",
          email: targetEmployee.email || "",
          phoneNumber: targetEmployee.phoneNumber || "",
          role: targetEmployee.role || "",
        });
      }
    }
  }, [editTargetId, employees]);

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
              <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                EMAIL
              </th>
              <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                TELEPON
              </th>
              <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                ROLE
              </th>
              {auth?.role === "superAdmin" && (
                <th className="min-w-[120px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                  ACTION
                </th>
              )}
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
                  <td className="px-4 py-3 text-center text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.fullname}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.email}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.phoneNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Employee.role || "-"}
                  </td>
                  {auth?.role === "superAdmin" && (
                    <td className="px-4 py-3 text-center text-gray-300">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(Employee.id)}
                          className="cursor-pointer rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(Employee.id)}
                          className="cursor-pointer rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Edit Data Karyawan
            </h2>

            {/* Form Edit */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(); // Lakukan dispatch edit atau logika update di sini
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 focus:ring focus:ring-blue-500 focus:outline-none"
                  value={editData.fullname}
                  onChange={(e) =>
                    setEditData({ ...editData, fullname: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 focus:ring focus:ring-blue-500 focus:outline-none"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  No Telepon
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 focus:ring focus:ring-blue-500 focus:outline-none"
                  value={editData.phoneNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, phoneNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Role</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`w-full rounded px-4 py-2 font-semibold ${
                      editData.role === "employee"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-700 text-gray-300 hover:bg-zinc-600 cursor-pointer"
                    }`}
                    onClick={() =>
                      setEditData({ ...editData, role: "employee" })
                    }
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    className={`w-full rounded px-4 py-2 font-semibold ${
                      editData.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-700 text-gray-300 hover:bg-zinc-600 cursor-pointer"
                    }`}
                    onClick={() => setEditData({ ...editData, role: "admin" })}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Konfirmasi Hapus
            </h2>
            <p className="mb-6 text-sm text-gray-300">
              Apakah Anda yakin ingin menghapus akun karyawan ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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
