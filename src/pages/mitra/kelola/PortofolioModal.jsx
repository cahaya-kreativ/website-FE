import React, { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { createPortofolioAction } from "../../../redux/action/admin/products/createPortofolioAction";
import { getProductsAction } from "../../../redux/action/admin/products/getProductsAction";
import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

const PortfolioModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const mediaPerPage = 6;
  const [currentMediaPage, setCurrentMediaPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    media: "",
    mediaType: "",
  });

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    const loadingToastId = showLoadingToast("Loading ...");

    const formData = new FormData();
    formData.append("title", newPortfolio.title);
    formData.append("description", newPortfolio.description);
    formData.append("product_id", product.id);

    if (newPortfolio.media instanceof File) {
      formData.append("media", newPortfolio.media);
    }

    const create = await dispatch(createPortofolioAction(formData));

    toast.dismiss(loadingToastId);
    if (create) {
      showSuccessToast("Add Portofolio successfully!");
      setTimeout(() => {
        dispatch(getProductsAction());
        setIsAddModalOpen(false);
        onClose();
        setNewPortfolio({
          title: "",
          description: "",
          media: "",
          mediaType: "",
        });
      }, 1000);
    }
  };

  // Menggabungkan semua media dari semua portofolio
  const allMedia = product.portfolios.flatMap(
    (portfolio) => portfolio.media || [],
  );

  // Menghitung total halaman
  const totalMediaPages = Math.ceil(allMedia.length / mediaPerPage);

  // Mengambil media untuk halaman saat ini
  const indexOfLastMedia = currentMediaPage * mediaPerPage;
  const indexOfFirstMedia = indexOfLastMedia - mediaPerPage;
  const currentMedia = allMedia.slice(indexOfFirstMedia, indexOfLastMedia);

  if (
    !product ||
    !Array.isArray(product.portfolios) ||
    product.portfolios.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-h-screen w-full max-w-4xl overflow-auto rounded-lg bg-zinc-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold text-white">
            Portofolio - {product.name}
          </h2>
          <div className="flex space-x-2">
            <button
              className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              onClick={() => setIsAddModalOpen(true)}
            >
              Tambah
            </button>
            {/* <button
              className="cursor-pointer rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
              // onClick={() => handleEditPortfolio()}
            >
              Update
            </button>
            <button
              className="cursor-pointer rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              // onClick={() => handleDeletePortfolio()}
            >
              Hapus
            </button> */}
          </div>
        </div>

        <div className="grid max-h-[80vh] grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
          {currentMedia.map((media, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded">
              {media.type === "IMAGE" ? (
                <img
                  onClick={() => setSelectedImage(media.url)}
                  src={media.url}
                  alt={`${media.title} - Media ${index + 1}`}
                  className="h-full w-full cursor-pointer object-cover"
                />
              ) : media.type === "VIDEO" ? (
                <video controls className="h-full w-full">
                  <source src={media.url} type="video/mp4" />
                  Video tidak didukung.
                </video>
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-700 text-gray-400">
                  Konten tidak tersedia
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalMediaPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <button
              disabled={currentMediaPage === 1}
              onClick={() => setCurrentMediaPage(currentMediaPage - 1)}
              className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-500"
            >
              Sebelumnya
            </button>
            <button
              disabled={currentMediaPage === totalMediaPages}
              onClick={() => setCurrentMediaPage(currentMediaPage + 1)}
              className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-500"
            >
              Selanjutnya
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Tutup
        </button>
      </motion.div>

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

      {/* Modal Add Portfolio */}
      {isAddModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setIsAddModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="w-full max-w-md rounded-lg bg-zinc-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-bold text-white">
              Tambah Portofolio
            </h3>
            <form onSubmit={handleAddPortfolio}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Judul
                </label>
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, title: e.target.value })
                  }
                  className="w-full rounded-md bg-zinc-700 px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Deskripsi
                </label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-md bg-zinc-700 px-3 py-2 text-white focus:outline-none"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Media
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      media: e.target.files[0],
                    })
                  }
                  className="mt-1 block w-full cursor-pointer text-sm text-gray-300 file:mr-4 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
                  required
                />
              </div>

              {/* <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Jenis Media
                </label>
                <select
                  value={newPortfolio.mediaType}
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      mediaType: e.target.value,
                    })
                  }
                  className="w-full rounded-md bg-zinc-700 px-3 py-2 text-white focus:outline-none"
                >
                  <option value="IMAGE">Gambar</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div> */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Product ID
                </label>
                <input
                  type="number"
                  value={product.id}
                  disabled
                  className="w-full cursor-not-allowed rounded-md bg-zinc-700 px-3 py-2 text-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

PortfolioModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    portfolios: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        media: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["IMAGE", "VIDEO"]),
          }),
        ),
      }),
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PortfolioModal;
