import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Redux Actions
import {
  getCountCustomersAction,
  getCountOrdersAction,
  getCountProductsAction,
  getCountCategoriesAction,
  getDashboardAction,
} from "../../redux/action/admin/dashboard/CountAction";
import { getDiscountAction } from "../../redux/action/admin/discount/DiscountAction";
import { createNotifAction } from "../../redux/action/admin/dashboard/CreateNotifAction";
import { createCategoriesAction } from "../../redux/action/admin/categories/createCategoriesAction";
import { updateCategoriesAction } from "../../redux/action/admin/categories/createCategoriesAction";
import { deleteCategoriesAction } from "../../redux/action/admin/categories/createCategoriesAction";
import { createDiscountAction } from "../../redux/action/admin/discount/DiscountAction";
import { updateDiscountAction } from "../../redux/action/admin/discount/DiscountAction";
import { deleteDiscountAction } from "../../redux/action/admin/discount/DiscountAction";

// Components
import { SidebarAdmin } from "../../assets/components/sidebar/SidebarAdmin";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import {
  FaBoxOpen,
  FaRegListAlt,
  FaUserFriends,
  FaShoppingCart,
  FaPlusCircle,
} from "react-icons/fa";
import { MdOutlineEdit, MdDelete } from "react-icons/md";

// Helper
import {
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
} from "../../helper/ToastHelper";

export const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditDiscountModal, setShowEditDiscountModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State Create Notif
  const [Title, setTitle] = useState("");
  const [Message, setMessage] = useState("");

  // State ADD Category
  const [Category, setCategory] = useState("");
  const [Description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // State Add Discount
  const [Code, setCode] = useState("");
  const [Percentage, setPercentage] = useState(null);

  // State Update Discount
  const [PutCode, setPutCode] = useState("");
  const [PutPercentage, setPutPercentage] = useState(null);
  const [PutStatus, setPutStatus] = useState("");

  // State Update Category
  const [PutCategory, setPutCategory] = useState("");
  const [PutDescription, setPutDescription] = useState("");
  const [PutImage, setPutImage] = useState(null);

  // Selected item for edit/delete
  const [selectedItem, setSelectedItem] = useState(null);

  // Show Image
  const [selectedImage, setSelectedImage] = useState(null);

  // Redux State
  const count = useSelector((state) => state.count);
  const categoriesTotal = useSelector((state) => state.count.dashboard);
  const discount = useSelector((state) => state.discount.discount);
  const orders = useSelector((state) => state.getOrder.get);

  // Fetch Data
  useEffect(() => {
    dispatch(getCountCustomersAction());
    dispatch(getCountOrdersAction());
    dispatch(getCountProductsAction());
    dispatch(getCountCategoriesAction());
    dispatch(getDashboardAction());
    dispatch(getDiscountAction());
  }, [dispatch]);

  useEffect(() => {
    const calculateTopProducts = () => {
      const productSalesMap = {};

      if (orders && orders.length > 0) {
        orders.forEach((order) => {
          if (order.orderDetails && order.orderDetails.length > 0) {
            order.orderDetails.forEach((detail) => {
              const productName = detail.product.name;
              const quantity = detail.quantity || 1; // Jika ada field quantity

              if (!productSalesMap[productName]) {
                productSalesMap[productName] = 0;
              }

              productSalesMap[productName] += quantity;
            });
          }
        });
      }

      // Konversi ke array dan urutkan berdasarkan total penjualan
      const topProducts = Object.entries(productSalesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4); // Ambil 5 produk terlaris

      return topProducts;
    };

    const topProducts = calculateTopProducts();

    const ctx = document.getElementById("chartjs-bar-chart").getContext("2d");

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topProducts.map((p) => p.name),
        datasets: [
          {
            label: "Penjualan Produk",
            data: topProducts.map((p) => p.count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#fff",
            },
          },
          x: {
            ticks: {
              color: "#fff",
            },
          },
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
          title: {
            display: true,
            text: "Produk Terlaris",
            color: "#fff",
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [orders]);

  // Open Edit Category Modal
  const openEditCategoryModal = (category) => {
    setSelectedItem({ ...category, type: "category" });
    setPutCategory(category.name || "");
    setPutDescription(category.description || "");
    setPutImage(null);
    setShowEditCategoryModal(true);
  };

  // Open Edit Discount Modal
  const openEditDiscountModal = (disc) => {
    setSelectedItem({ ...disc, type: "discount" });
    setPutCode(disc.code || "");
    setPutPercentage(disc.percentage || "");
    setPutStatus(disc.status ? "true" : "false");
    setShowEditDiscountModal(true);
  };

  const handleInput = (e) => {
    if (e) {
      if (e.target.id === "title") {
        setTitle(e.target.value);
      }
      if (e.target.id === "message") {
        setMessage(e.target.value);
      }
      if (e.target.id === "name") {
        setCategory(e.target.value);
      }
      if (e.target.id === "description") {
        setDescription(e.target.value);
      }
      if (e.target.id === "name2") {
        setPutCategory(e.target.value);
      }
      if (e.target.id === "description2") {
        setPutDescription(e.target.value);
      }
      if (e.target.id === "code") {
        setCode(e.target.value);
      }
      if (e.target.id === "percentage") {
        const percentageValue = parseInt(e.target.value, 10);
        setPercentage(isNaN(percentageValue) ? null : percentageValue);
      }
      if (e.target.id === "code2") {
        setPutCode(e.target.value);
      }
      if (e.target.id === "percentage2") {
        const percentageValue = parseInt(e.target.value, 10);
        setPutPercentage(isNaN(percentageValue) ? null : percentageValue);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddCategory = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", Category);
    formData.append("description", Description);

    const create = await dispatch(createCategoriesAction(formData));

    toast.dismiss(loadingToastId);

    if (create) {
      showSuccessToast("Create New Category successfully!");
      setTimeout(() => {
        dispatch(getDashboardAction());
        dispatch(getCountCategoriesAction());
        setShowCategoryModal(false);
        setCategory("");
        setDescription("");
        setImage(null);
      }, 1000);
    }
  };

  const handleAddDiscount = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const createDiscount = await dispatch(
      createDiscountAction({
        code: Code,
        percentage: parseInt(Percentage, 10),
      }),
    );

    toast.dismiss(loadingToastId);

    if (createDiscount) {
      showSuccessToast("Create New Discount Successfully!");
      setTimeout(() => {
        dispatch(getDiscountAction());
        setShowDiscountModal(false);
        setCode("");
        setPercentage(null);
      }, 1000);
    }
  };

  const handleUpdateCategory = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const updatedData = {
      name: PutCategory,
      description: PutDescription,
      image: PutImage,
    };

    const result = await dispatch(
      updateCategoriesAction(selectedItem.id, updatedData),
    );

    toast.dismiss(loadingToastId);
    if (result) {
      showSuccessToast("Updated Category successfully!");
      setTimeout(() => {
        dispatch(getDashboardAction());
        setShowEditCategoryModal(false);
      }, 1000);
    }
  };

  const handleUpdateDiscount = async () => {
    const loadingToastId = showLoadingToast("Loading...");
    const updatedData = {
      code: PutCode,
      percentage: PutPercentage,
      status: PutStatus === "true", // Pastikan boolean
    };
    const result = await dispatch(
      updateDiscountAction(selectedItem.id, updatedData),
    );
    toast.dismiss(loadingToastId);
    if (result) {
      showSuccessToast("Updated Discount successfully!");
      setTimeout(() => {
        dispatch(getDiscountAction());
        setShowEditDiscountModal(false);
      }, 1000);
    }
  };

  const handleCreateNotif = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const createNotif = await dispatch(
      createNotifAction({
        title: Title,
        message: Message,
      }),
    );

    toast.dismiss(loadingToastId);

    if (createNotif) {
      showSuccessToast("Create Notification Successfully!");
      setTimeout(() => {
        setShowNotificationModal(false);
        setTitle("");
        setMessage("");
      }, 1000);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedItem || !selectedItem.id) {
      showErrorToast("ID kategori tidak ditemukan.");
      return;
    }

    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(deleteCategoriesAction(selectedItem.id));
    toast.dismiss(loadingToastId);

    if (result) {
      // showSuccessToast("Delete Category Successfully!");
      setTimeout(() => {
        dispatch(getDashboardAction()); // Refresh data
        dispatch(getCountCategoriesAction());
        setShowDeleteModal(false);
      }, 1000);
    }
  };

  const handleDeleteDiscount = async () => {
    if (!selectedItem || !selectedItem.id) {
      showErrorToast("ID diskon tidak ditemukan.");
      return;
    }

    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(deleteDiscountAction(selectedItem.id));
    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Delete Discount Successfully!");
      setTimeout(() => {
        dispatch(getDiscountAction());
        setShowDeleteModal(false);
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
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
            <p className="mt-1 text-sm text-gray-400">
              Ringkasan data terbaru dari sistem.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              className="relative cursor-pointer rounded-full bg-zinc-700 p-3 text-gray-300 hover:bg-zinc-600 focus:outline-none"
              onClick={() => setShowNotificationModal(true)}
            >
              <FiBell className="h-6 w-6 text-white" />
              <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xl font-bold text-white">
                +
              </div>
            </button>
          </div>
        </div>

        {/* Cards Summary */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card Pesanan */}
          <div className="rounded-lg bg-zinc-800 p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Jumlah Pesanan
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {count.countOrders}
                </h2>
              </div>
              <FaShoppingCart className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          {/* Card Kategori */}
          <div className="rounded-lg bg-zinc-800 p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Kategori
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {count.countCategories}
                </h2>
              </div>
              <FaRegListAlt className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          {/* Card Produk */}
          <div className="rounded-lg bg-zinc-800 p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Produk
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {count.countProducts}
                </h2>
              </div>
              <FaBoxOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          {/* Card Pelanggan */}
          <div className="rounded-lg bg-zinc-800 p-6 shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Pelanggan
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {count.countCustomers}
                </h2>
              </div>
              <FaUserFriends className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-zinc-800 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Statistik Pesanan
          </h2>

          <div className="overflow-x-auto">
            <canvas
              id="chartjs-bar-chart"
              width="1500"
              height="500"
              className="max-w-full"
            ></canvas>
          </div>
        </div>

        {/* Table: Categories */}
        <div className="mt-10 rounded-lg bg-zinc-800 p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Daftar Kategori
            </h2>
            <button
              className="flex cursor-pointer items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              onClick={() => setShowCategoryModal(true)}
            >
              <FaPlusCircle className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-zinc-700">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Nama Kategori
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Deskripsi
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Gambar
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Pesanan
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {Array.isArray(categoriesTotal) &&
                categoriesTotal.length > 0 ? (
                  categoriesTotal.map((category, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {category.name || "-"}
                      </td>
                      <td className="max-w-xs overflow-hidden px-4 py-4 text-sm break-words text-gray-300">
                        {category.description || "-"}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 cursor-pointer rounded object-cover"
                            onClick={() => setSelectedImage(category.image)}
                          />
                        ) : (
                          <span className="text-gray-500">
                            Tidak ada gambar
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {category.totalProducts || 0}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {category.totalOrders || 0}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        <button
                          className="mr-2 text-blue-500 hover:text-blue-300"
                          onClick={() => openEditCategoryModal(category)}
                        >
                          <MdOutlineEdit size={24} className="cursor-pointer" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-300"
                          onClick={() => {
                            setSelectedItem({ ...category, type: "category" });
                            setShowDeleteModal(true);
                          }}
                        >
                          <MdDelete size={24} className="cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 text-center text-sm text-gray-400"
                    >
                      Tidak ada kategori ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table: Discount */}
        <div className="mt-10 rounded-lg bg-zinc-800 p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Pengaturan Diskon
            </h2>
            <button
              className="flex cursor-pointer items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              onClick={() => setShowDiscountModal(true)}
            >
              <FaPlusCircle className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-zinc-700">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Kode Diskon
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Persentase (%)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {Array.isArray(discount) && discount.length > 0 ? (
                  discount.map((disc, index) => (
                    <tr key={disc.id}>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {disc.code || "-"}
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        {disc.percentage || 0}%
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs ${
                            disc.status
                              ? "bg-green-700 text-green-100"
                              : "bg-red-700 text-red-100"
                          }`}
                        >
                          {disc.status ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-300">
                        <button
                          className="mr-2 text-blue-500 hover:text-blue-300"
                          onClick={() => openEditDiscountModal(disc)}
                        >
                          <MdOutlineEdit size={24} className="cursor-pointer" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-300"
                          onClick={() => {
                            setSelectedItem({ ...disc, type: "discount" });
                            setShowDeleteModal(true);
                          }}
                        >
                          <MdDelete size={24} className="cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-sm text-gray-400"
                    >
                      Tidak ada diskon ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Tambah Kategori
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Nama Kategori
                </label>
                <input
                  value={Category}
                  onChange={handleInput}
                  id="name"
                  type="text"
                  placeholder="Masukkan nama kategori"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Deskripsi
                </label>
                <textarea
                  rows="3"
                  value={Description}
                  onChange={handleInput}
                  id="description"
                  placeholder="Masukkan deskripsi"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Gambar
                </label>
                <input
                  onChange={handleImageUpload}
                  id="image"
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full cursor-pointer text-white file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    handleAddCategory();
                  }}
                  className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Diskon */}
      {showDiscountModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">Tambah Diskon</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Kode Diskon
                </label>
                <input
                  value={Code}
                  onChange={handleInput}
                  id="code"
                  type="text"
                  placeholder="Contoh: DISKON10"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Persentase (%)
                </label>
                <input
                  value={Percentage}
                  onChange={handleInput}
                  id="percentage"
                  type="number"
                  placeholder="Contoh: 10"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => setShowDiscountModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    handleAddDiscount();
                  }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kategori */}
      {showEditCategoryModal && selectedItem && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">Edit Kategori</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Nama Kategori
                </label>
                <input
                  id="name2"
                  value={PutCategory}
                  onChange={handleInput}
                  type="text"
                  placeholder="Masukkan nama kategori"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Deskripsi
                </label>
                <textarea
                  id="description2"
                  value={PutDescription}
                  onChange={handleInput}
                  rows="3"
                  placeholder="Masukkan deskripsi"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Gambar
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 w-full cursor-pointer text-white file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => setShowEditCategoryModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={handleUpdateCategory}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Diskon */}
      {showEditDiscountModal && selectedItem && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">Edit Diskon</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Kode Diskon
                </label>
                <input
                  type="text"
                  id="code2"
                  value={PutCode}
                  onChange={handleInput}
                  placeholder="Masukkan kode diskon"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Persentase (%)
                </label>
                <input
                  type="number"
                  id="percentage2"
                  value={PutPercentage}
                  onChange={handleInput}
                  placeholder="Masukkan persentase"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Status
                </label>
                <select
                  className="mt-1 w-full cursor-pointer rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  value={PutStatus}
                  onChange={(e) => setPutStatus(e.target.value)}
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => setShowEditDiscountModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={handleUpdateDiscount}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {showDeleteModal && selectedItem && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Konfirmasi Hapus
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-white">
                {selectedItem.name || selectedItem.code}
              </strong>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={
                  selectedItem.type === "category"
                    ? handleDeleteCategory
                    : handleDeleteDiscount
                }
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notifikasi Massal */}
      {showNotificationModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Kirim Notifikasi
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Judul
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul notifikasi"
                  value={Title}
                  onChange={handleInput}
                  id="title"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">
                  Pesan
                </label>
                <textarea
                  rows="3"
                  value={Message}
                  onChange={handleInput}
                  id="message"
                  placeholder="Masukkan pesan notifikasi"
                  className="mt-1 w-full rounded border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => setShowNotificationModal(false)}
                >
                  Batal
                </button>
                <button
                  className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => {
                    handleCreateNotif();
                  }}
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Zoom Gambar */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            src={selectedImage}
            alt="Zoomed"
            className="max-h-full max-w-full object-contain"
          />
        </motion.div>
      )}
    </div>
  );
};
