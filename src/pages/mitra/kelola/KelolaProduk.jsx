import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";
import { getProductsAction } from "../../../redux/action/admin/products/getProductsAction";
import { getCategoriesAction } from "../../../redux/action/admin/categories/getCategoriesAction";
import PortfolioModal from "./PortofolioModal";
import ReviewModal from "./ReviewModal";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "../../../redux/action/admin/products/createProductAction";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { MdOutlineEdit, MdDelete } from "react-icons/md";

export const KelolaProduk = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const productsPerPage = 10;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Ambil data produk dari Redux store
  const products = useSelector((state) => state.getProducts.products || []);
  const categories = useSelector(
    (state) => state.getCategories.categories || [],
  );

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastProducts = currentPage * productsPerPage;
  const indexOfFirstProducts = indexOfLastProducts - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProducts,
    indexOfLastProducts,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const getPaginationGroup = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return new Array(end - start + 1).fill(null).map((_, idx) => start + idx);
  };

  useEffect(() => {
    dispatch(getProductsAction());
    dispatch(getCategoriesAction());
  }, [dispatch]);

  const formatDuration = (duration) => {
    if (duration >= 720) {
      const months = Math.floor(duration / 720);
      return `${months} bulan`;
    } else if (duration >= 24) {
      const days = Math.floor(duration / 24);
      return `${days} hari`;
    } else {
      return `${duration} jam`;
    }
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const openEditModal = (product) => {
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      label: product.label || "",
      duration: product.duration || "",
      detail: product.detail || "",
      price: product.price || "",
      category_id: product.category_id || "",
      note: product.note || "",
      addOn: product.addOn || "",
      id: product.id || "",
    });
    setShowAddModal(true);
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    label: "",
    duration: "",
    detail: "",
    image: null,
    price: "",
    category_id: "",
    note: "",
    addOn: "",
  });

  const handleProductChange = (e) => {
    const { id, value } = e.target;

    setNewProduct({
      ...newProduct,
      [id]: value,
    });
  };

  const {
    name,
    description,
    label,
    duration,
    detail,
    price,
    image,
    category_id,
    note,
    addOn,
  } = newProduct;

  const handleAddProduct = async (e) => {
    e?.preventDefault();
    const loadingToastId = showLoadingToast("Loading ...");

    const formData = new FormData();
    // Tambahkan semua field dari newProduct
    for (const key in newProduct) {
      if (key === "image") {
        if (newProduct.image instanceof File) {
          formData.append(key, newProduct.image);
        }
      } else {
        formData.append(key, newProduct[key]);
      }
    }

    let result;
    if (newProduct.id) {
      // Jika ada ID, ini adalah operasi EDIT
      result = await dispatch(updateProductAction(newProduct.id, formData));
    } else {
      // Jika tidak ada ID, ini adalah operasi TAMBAH
      result = await dispatch(createProductAction(formData));
    }

    toast.dismiss(loadingToastId);
    if (result) {
      showSuccessToast(
        newProduct.id
          ? "Produk berhasil diubah!"
          : "Produk berhasil ditambahkan!",
      );
      setTimeout(() => {
        dispatch(getProductsAction());
        setShowAddModal(false);
        setNewProduct({
          name: "",
          description: "",
          label: "",
          duration: "",
          detail: "",
          price: "",
          category_id: "",
          note: "",
          addOn: "",
          image: null,
          id: "",
        });
      }, 1000);
    }
  };

  const handleDeleteProduct = async () => {
    const productId = selectedProduct?.id;
    if (!productId) {
      showErrorToast("ID produk tidak ditemukan.");
      return;
    }

    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(deleteProductAction(productId));
    toast.dismiss(loadingToastId);

    if (result) {
      setTimeout(() => {
        dispatch(getProductsAction());
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
      <SidebarAdmin
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            {/* Judul dan Tombol Tambah */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Kelola Produk</h1>
              <button
                className="flex cursor-pointer items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlusCircle className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Kolom Pencarian */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full divide-y divide-zinc-700 rounded-lg bg-zinc-900 text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-800">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "50px", width: "5%" }}
                  >
                    NO
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "150px", width: "20%" }}
                  >
                    NAMA PRODUK
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "120px", width: "15%" }}
                  >
                    KATEGORI
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "200px", width: "25%" }}
                  >
                    DESKRIPSI
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "100px", width: "10%" }}
                  >
                    HARGA
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "100px", width: "10%" }}
                  >
                    GAMBAR
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "100px", width: "10%" }}
                  >
                    DURASI
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "100px", width: "10%" }}
                  >
                    Detail
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "150px", width: "15%" }}
                  >
                    AKSI
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "120px", width: "12%" }}
                  >
                    PORTOFOLIO
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    style={{ minWidth: "120px", width: "12%" }}
                  >
                    ULASAN
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-6 text-center text-gray-400">
                      {searchTerm
                        ? `Tidak ditemukan produk bernama "${searchTerm}"`
                        : "Belum ada data produk"}
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="transition-colors duration-200 hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {indexOfFirstProducts + index + 1}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {product.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {product.category?.name || "Tanpa kategori"}
                      </td>
                      <td className="max-w-[250px] px-4 py-3 break-words whitespace-pre-wrap text-gray-300">
                        {product.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {product.label || "-"}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        Rp {product.price || 0}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            onClick={() => setSelectedImage(product.image)}
                            className="mx-auto h-12 w-12 cursor-pointer rounded object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">
                            Tidak ada gambar
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-gray-300">
                        {formatDuration(product.duration)}
                      </td>
                      <td className="space-x-2 px-4 py-3 text-center whitespace-nowrap text-white">
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={() => openDetailModal(product)}
                        >
                          <FiEye size={24} className="cursor-pointer" />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => openEditModal(product)}
                        >
                          <MdOutlineEdit size={24} className="cursor-pointer" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedProduct({ ...product });
                            setShowDeleteModal(true);
                          }}
                        >
                          <MdDelete size={24} className="cursor-pointer" />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowPortfolioModal(true);
                          }}
                          className="cursor-pointer text-blue-500 hover:text-blue-600"
                        >
                          Lihat Portofolio
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowReviewModal(true);
                          }}
                          className="cursor-pointer text-blue-500 hover:text-blue-600"
                        >
                          Lihat Ulasan
                        </button>
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
              Showing {indexOfFirstProducts + 1} to{" "}
              {Math.min(indexOfLastProducts, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
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

      {/* Modal Tambah Produk */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="w-full max-w-lg rounded-lg bg-zinc-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-white">
              Tambah Produk Baru
            </h2>

            {/* Form Fields */}
            <form className="space-y-4">
              {/* Bagian Kiri */}
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  {/* Name */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Nama Produk
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Deskripsi
                    </label>
                    <textarea
                      required
                      id="description"
                      rows={3}
                      value={newProduct.description}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Label
                    </label>
                    <input
                      id="label"
                      type="text"
                      required
                      value={newProduct.label}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Durasi (jam)
                    </label>
                    <input
                      id="duration"
                      type="number"
                      required
                      value={newProduct.duration}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Detail */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Detail
                    </label>
                    <textarea
                      id="detail"
                      required
                      rows={3}
                      value={newProduct.detail}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    ></textarea>
                  </div>
                </div>

                {/* Bagian Kanan */}
                <div className="flex-1">
                  {/* Image Upload */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Gambar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          image: e.target.files[0],
                        })
                      }
                      className="mt-1 block w-full cursor-pointer text-sm text-gray-300 file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Harga (example: 250.000)
                    </label>
                    <input
                      id="price"
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Category ID */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Kategori
                    </label>
                    <select
                      id="category_id"
                      required
                      value={newProduct.category_id}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note (Optional) */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Catatan (Opsional)
                    </label>
                    <input
                      id="note"
                      type="text"
                      value={newProduct.note}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Add On (Optional) */}
                  <div>
                    <label className="block py-2 text-sm font-medium text-gray-300">
                      Add On (Opsional)
                    </label>
                    <input
                      id="addOn"
                      type="text"
                      value={newProduct.addOn}
                      onChange={handleProductChange}
                      className="mt-1 block w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProduct({
                      name: "",
                      description: "",
                      label: "",
                      duration: "",
                      detail: "",
                      price: "",
                      category_id: "",
                      note: "",
                      addOn: "",
                      image: null,
                      id: "",
                    });
                  }}
                  className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleAddProduct(e)}
                  className="cursor-pointer rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Hapus */}
      {showDeleteModal && selectedProduct && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-zinc-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Konfirmasi Hapus
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-white">
                {selectedProduct.name} - {selectedProduct.label}
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
                onClick={handleDeleteProduct}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Produk */}
      {showDetailModal && selectedProduct && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 right-0 z-50 flex max-w-md overflow-hidden bg-zinc-800 shadow-xl"
        >
          <div className="relative flex h-full w-full flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-700 p-4">
              <h2 className="text-lg font-bold text-white">Detail Produk</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4 p-4">
              {/* Nama Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Nama Produk
                </label>
                <p className="mt-1 text-gray-300">
                  {selectedProduct.name || "-"}
                </p>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Deskripsi
                </label>
                <p className="mt-1 text-gray-300">
                  {selectedProduct.description || "-"}
                </p>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Label
                </label>
                <p className="mt-1 text-gray-300">
                  {selectedProduct.label || "-"}
                </p>
              </div>

              {/* Durasi */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Durasi
                </label>
                <p className="mt-1 text-gray-300">
                  {formatDuration(selectedProduct.duration)}
                </p>
              </div>

              {/* Detail */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Detail
                </label>
                {(() => {
                  if (Array.isArray(selectedProduct.detail)) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.detail.map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  } else if (
                    typeof selectedProduct.detail === "string" &&
                    selectedProduct.detail.includes(",")
                  ) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.detail
                          .split(",")
                          .map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                      </ul>
                    );
                  } else {
                    return (
                      <p className="mt-1 text-gray-300">
                        {selectedProduct.detail || "-"}
                      </p>
                    );
                  }
                })()}
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Harga
                </label>
                <p className="mt-1 text-gray-300">
                  Rp {selectedProduct.price || "0"}
                </p>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Kategori
                </label>
                <p className="mt-1 text-gray-300">
                  {selectedProduct.category?.name || "Tanpa kategori"}
                </p>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Note
                </label>
                {(() => {
                  if (Array.isArray(selectedProduct.note)) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.note.map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  } else if (
                    typeof selectedProduct.note === "string" &&
                    selectedProduct.note.includes(",")
                  ) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.note.split(",").map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return (
                      <p className="mt-1 text-gray-300">
                        {selectedProduct.note || "-"}
                      </p>
                    );
                  }
                })()}
              </div>

              {/* Add On */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Add On
                </label>
                {(() => {
                  if (Array.isArray(selectedProduct.addOn)) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.addOn.map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  } else if (
                    typeof selectedProduct.addOn === "string" &&
                    selectedProduct.addOn.includes(",")
                  ) {
                    return (
                      <ul className="mt-1 list-disc pl-5 text-gray-300">
                        {selectedProduct.addOn.split(",").map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return (
                      <p className="mt-1 text-gray-300">
                        {selectedProduct.addOn || "-"}
                      </p>
                    );
                  }
                })()}
              </div>

              {/* Gambar */}
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Gambar
                </label>
                <div className="mt-1">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt="Produk"
                      className="mx-auto h-32 w-32 rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Tidak ada gambar</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal Portofolio */}
      {showPortfolioModal && selectedProduct && (
        <PortfolioModal
          product={selectedProduct}
          onClose={() => setShowPortfolioModal(false)}
        />
      )}

      {/* Modal Ulasan */}
      {showReviewModal && selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};
