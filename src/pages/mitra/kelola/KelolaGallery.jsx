import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";

// Component
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";
import { getGalleriesAction } from "../../../redux/action/admin/gallery/GetGalleryAction";
import {
  createGalleryAction,
  deleteGalleryAction,
} from "../../../redux/action/admin/gallery/ButtonGalleryAction";
import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

export const KelolaGallery = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [galleryData, setGalleryData] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Pagination State
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Get Gallery Data from Redux
  const galleryState = useSelector((state) => state.getGalleries.galleries);

  // Fetch Gallery Data on Mount
  useEffect(() => {
    dispatch(getGalleriesAction());
  }, [dispatch]);

  // Update Gallery Data and Categories
  useEffect(() => {
    if (galleryState) {
      setGalleryData(galleryState);

      const categories = [
        "all",
        ...new Set(galleryState.map((item) => item.category)),
      ];
      setUniqueCategories(categories);
    }
  }, [galleryState]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryData.slice(indexOfFirstItem, indexOfLastItem);

  // Generate max 5 pagination buttons
  const getPaginationGroup = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(
      Math.ceil(galleryData.length / itemsPerPage),
      start + 4,
    );
    return new Array(end - start + 1).fill(null).map((_, idx) => start + idx);
  };

  // Handle Image Click
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleDeleteGallery = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(deleteGalleryAction(selectedImage.id));

    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Delete Gallery Successfully!");
      setTimeout(() => {
        dispatch(getGalleriesAction());
        setIsDeleteModalOpen(false);
      }, 1000);
    }
  };

  const handleCreateGallery = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);

    const loadingToastId = showLoadingToast("Loading ...");

    const result = await dispatch(createGalleryAction(formData));

    toast.dismiss(loadingToastId);

    if (result) {
      showSuccessToast("Create Gallery Successfully!");
      setTimeout(() => {
        dispatch(getGalleriesAction());
        setIsAddModalOpen(false);
        setImage("");
        setCategory("");
        setIsCustomCategory(false);
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
            <h1 className="text-2xl font-bold text-white">Kelola Gallery</h1>
          </div>

          {/* Filter Section - Justify Between */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-white ${
                    selectedCategory === category
                      ? "bg-blue-500"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="ml-auto cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Tambah Gambar
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentItems
              .filter(
                (item) =>
                  selectedCategory === "all" ||
                  item.category === selectedCategory,
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:scale-105 bg-zinc-700"
                  onClick={() => handleImageClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.category}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="cursor-pointer rounded-l-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Prev
            </button>
            {getPaginationGroup().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`mx-1 cursor-pointer rounded-lg px-4 py-2 ${
                  currentPage === pageNumber
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={
                currentPage === Math.ceil(galleryData.length / itemsPerPage)
              }
              onClick={() => setCurrentPage(currentPage + 1)}
              className="cursor-pointer rounded-r-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Modal Aksi: Lihat, Hapus */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between text-white">
              <h2 className="text-2xl font-semibold">Aksi Gambar</h2>
              <AiOutlineClose
                size={24}
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={selectedImage.image}
                alt={selectedImage.category}
                className="w-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            </div>

            <p className="mb-6 text-sm text-gray-300">
              Kategori:{" "}
              <span className="font-medium capitalize">
                {selectedImage.category}
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(true);
                  setIsModalOpen(false);
                }}
                className="cursor-pointer rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
              >
                Lihat
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setIsModalOpen(false);
                }}
                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Gambar Fullscreen */}
      {isViewModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-auto">
            <img
              src={selectedImage.image}
              alt={selectedImage.category}
              className="max-h-[80vh] w-full object-contain"
            />
            <p className="mt-2 text-center text-white">
              Kategori:{" "}
              <span className="font-semibold capitalize">
                {selectedImage.category}
              </span>
            </p>
            <AiOutlineClose
              size={35}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 cursor-pointer text-red-500"
            />
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Konfirmasi Hapus
            </h2>
            <p className="mb-6 text-sm text-gray-300">
              Apakah Anda yakin ingin menghapus gambar ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteGallery}
                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Gambar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Tambah Gambar
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Input Kategori: Dropdown atau Manual */}
              <div>
                <label className="block text-sm text-gray-300">Kategori</label>

                {/* Jika mode dropdown */}
                {!isCustomCategory ? (
                  <select
                    className="w-full cursor-pointer rounded border border-zinc-700 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setIsCustomCategory(true);
                        setCategory("");
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih kategori
                    </option>
                    {uniqueCategories
                      .filter((c) => c !== "all")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </option>
                      ))}
                    <option value="custom">+ Tambah Kategori Baru</option>
                  </select>
                ) : (
                  /* Jika mode input manual */
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Masukkan kategori baru"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded border border-zinc-700 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="cursor-pointer text-xs text-gray-400 hover:text-white"
                    >
                      Kembali ke daftar kategori
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-sm text-gray-300">
                  Upload Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full cursor-pointer rounded border border-zinc-700 bg-zinc-700 px-4 py-2 text-white file:text-blue-500"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer rounded-lg bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateGallery}
                  type="submit"
                  className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
