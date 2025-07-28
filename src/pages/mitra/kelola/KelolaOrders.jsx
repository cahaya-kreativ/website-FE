import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";

// Helper
import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Redux Action
import { getOrdersAction } from "../../../redux/action/admin/order/GetOrderAction";
import { getChatAdminAction } from "../../../redux/action/admin/chat/chatAdminAction";
import {
  cancelOrderAction,
  validateOrderAction,
  doneOrderAction,
} from "../../../redux/action/admin/order/CancelOrderAction";

export const KelolaOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data orders dari Redux Store
  const orders = useSelector((state) => state.getOrder.get || []);
  const auth = useSelector((state) => state.authLoginAdmin.admin);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const ordersPerPage = 10;

  // Format functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "unpaid":
        return "bg-gray-500 text-white";
      case "process":
        return "bg-blue-500 text-white";
      case "done":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    if (!order || !order.status) return false;

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesName = order.user?.fullname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesName;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const getPaginationGroup = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return new Array(end - start + 1).fill(null).map((_, idx) => start + idx);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!orders || orders.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const worksheetData = orders.map((order, index) => ({
      No: index + 1,
      "Order ID": order.code || "-",
      "Tanggal Pesan": formatDate(order.createdAt),
      Status:
        order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "-",
      Customer: order.user?.fullname || "-",
      Product: order.orderDetails[0]?.product?.name || "-",
      Label: order.orderDetails[0]?.product?.label || "-",
      Amount: formatCurrency(order.total_amount),
      "Schedule Date": order.schedule?.date
        ? formatDate(order.schedule.date)
        : "-",
      "End Date": order.schedule?.endDate
        ? formatDate(order.schedule.endDate)
        : "-",
      Time: order.schedule?.time || "-",
      "End Time": order.schedule?.endTime || "-",
      Location: order.schedule?.location ?? "-",
      Note: order.note || "-",
      "Is Paid": order.is_paid ? "Yes" : "No",
      Payment:
        order.payments && order.payments.length > 0
          ? order.payments
              .map((p) => `${p.method_payment} (${p.status})`)
              .join(", ")
          : "No payment",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Orders");
    XLSX.writeFile(workbook, "All_Orders.xlsx");
  };

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getOrdersAction());
  }, [dispatch]);

  // Modal States
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [doneModalOpen, setDoneModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelOrder = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(
      cancelOrderAction(selectedOrderId, { reason: cancelReason }),
    );

    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Cancelled Order Successfully!");
      setTimeout(() => {
        dispatch(getOrdersAction());
        setCancelModalOpen(false);
        setCancelReason("");
      }, 1000);
    }
  };

  const handleValidateOrder = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(validateOrderAction(selectedOrderId));
    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Validate Order Successfully!");
      setTimeout(() => {
        dispatch(getOrdersAction());
        setValidateModalOpen(false);
      }, 1000);
    }
  };

  const handleDoneOrder = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(doneOrderAction(selectedOrderId));
    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Order status changed to done Successfully!");
      setTimeout(() => {
        dispatch(getOrdersAction());
        setDoneModalOpen(false);
      }, 1000);
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Orders History</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToExcel}
                className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Export to Excel
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            {/* Search Input */}
            <div className="min-w-[100px] flex-grow sm:min-w-[200px]">
              <input
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-[40%] rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="min-w-[180px]">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="process">Process</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table with Scroll */}
          <div className="overflow-x-auto rounded-lg border border-zinc-700 shadow-md">
            <table className="min-w-max table-auto divide-y divide-zinc-700 text-xs sm:text-sm">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    NO
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    ORDER ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    TGL PESAN
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    PRODUCT
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    LABEL
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    AMOUNT
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    SCHEDULE DATE
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    END DATE
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    TIME
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    END TIME
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-normal text-gray-400 uppercase">
                    LOCATION
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-normal text-gray-400 uppercase">
                    NOTE
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    IS PAID
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    PAYMENT
                  </th>
                  <th className="px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                    ACTION
                  </th>
                  {auth?.role === "superAdmin" && (
                    <th className="min-w-[60px] px-4 py-3 text-center text-xs tracking-wider whitespace-nowrap text-gray-400 uppercase">
                      CHAT
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700 bg-zinc-900">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-zinc-800"
                    >
                      <td className="px-4 py-3 text-center text-gray-300">
                        {indexOfFirstOrder + index + 1}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.code || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.user?.fullname || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.orderDetails[0]?.product?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.orderDetails[0]?.product?.label || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.schedule?.date
                          ? formatDate(order.schedule.date)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.schedule?.endDate
                          ? formatDate(order.schedule.endDate)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.schedule?.time || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.schedule?.endTime || "-"}
                      </td>
                      <td className="max-w-xs px-4 py-3 whitespace-normal text-gray-300">
                        {order.schedule?.location ?? "-"}
                      </td>
                      <td className="max-w-xs px-4 py-3 whitespace-normal text-gray-300">
                        {order.note || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs ${order.is_paid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                        >
                          {order.is_paid ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {order.payments && order.payments.length > 0
                          ? order.payments.map((p, idx) => (
                              <div key={idx}>
                                {p.method_payment} ({p.status})
                              </div>
                            ))
                          : "No payment"}
                      </td>
                      <td className="flex items-center space-x-2 px-4 py-3 text-gray-300">
                        <button
                          className="cursor-pointer text-blue-500 hover:text-blue-400"
                          title="Validate Order"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setValidateModalOpen(true);
                          }}
                        >
                          <FaRegClock size={20} />
                        </button>
                        <button
                          className="cursor-pointer text-green-500 hover:text-green-400"
                          title="Done Order"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setDoneModalOpen(true);
                          }}
                        >
                          <FaCheckCircle size={20} />
                        </button>
                        <button
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          title="Cancel Order"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setCancelModalOpen(true);
                          }}
                        >
                          <MdCancel size={24} />
                        </button>
                      </td>
                      {auth?.role === "superAdmin" && (
                        <td className="px-4 py-3 text-white">
                          <BsChatDotsFill
                            className="ml-2 cursor-pointer"
                            size={20}
                            onClick={() => {
                              dispatch(getChatAdminAction(order.user?.id));
                              navigate("/admin/chat");
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="py-4 text-center text-gray-400">
                      {searchTerm
                        ? `Tidak ditemukan order dari pengguna bernama "${searchTerm}"`
                        : "Belum ada data pengguna"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>

            <nav className="relative z-0 inline-flex rounded-md shadow-sm">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className={`relative inline-flex cursor-pointer items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-400 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50 ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className={`relative inline-flex cursor-pointer items-center rounded-r-md px-3 py-2 text-sm font-medium text-gray-400 ring-1 ring-zinc-700 ring-inset hover:bg-zinc-800 disabled:opacity-50 ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </main>

      {validateModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Validasi Order
            </h2>
            <p className="text-gray-400">
              Apakah Anda yakin ingin mengvalidasi pesanan ini?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setValidateModalOpen(false)}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleValidateOrder}
                className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Validasi
              </button>
            </div>
          </div>
        </div>
      )}

      {doneModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Selesaikan Order
            </h2>
            <p className="text-gray-400">
              Apakah Anda yakin ingin menandai pesanan ini sebagai selesai?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setDoneModalOpen(false)}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDoneOrder}
                className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Batalkan Order
            </h2>
            <p className="mb-4 text-gray-400">Masukkan alasan pembatalan:</p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Alasan pembatalan..."
              className="w-full rounded border border-zinc-700 bg-zinc-700 px-4 py-2 text-gray-300 focus:border-blue-500 focus:outline-none"
              rows="3"
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancelReason("");
                }}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!cancelReason.trim()}
                className={`rounded px-4 py-2 text-white ${
                  cancelReason.trim()
                    ? "cursor-pointer bg-red-500 hover:bg-red-600"
                    : "cursor-not-allowed bg-red-300"
                }`}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
