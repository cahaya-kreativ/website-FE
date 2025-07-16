import React, { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({ product, onClose }) => {
  const reviewsPerPage = 5; // Jumlah ulasan per halaman
  const [currentPage, setCurrentPage] = useState(1);

  // Menghitung total halaman
  const totalPages = Math.ceil(product.reviews.length / reviewsPerPage);

  // Mengambil ulasan untuk halaman saat ini
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = product.reviews.slice(
    indexOfFirstReview,
    indexOfLastReview,
  );

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const initials = names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  // Menghitung average rating
  const averageRating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;

  // Memeriksa apakah data produk valid
  if (
    !product ||
    !Array.isArray(product.reviews) ||
    product.reviews.length === 0
  ) {
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
          className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-zinc-800 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4 text-xl font-bold text-white">
            Ulasan - {product.name}
          </h2>
          <p className="text-gray-400">Belum ada ulasan.</p>
        </motion.div>
      </motion.div>
    );
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
        className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-zinc-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold text-white">
            Ulasan - {product.name}
          </h2>
          <p className="text-sm font-medium text-gray-400">
            Rata-rata: {averageRating.toFixed(1)}
          </p>
        </div>

        <div className="space-y-4">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-zinc-700 bg-zinc-700 px-4 py-2 last:border-b-0"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {review.user?.profile?.avatar_url ? (
                    <img
                      src={review.user.profile.avatar_url}
                      alt="Profile"
                      className="inline-block h-7 w-7 rounded-full"
                    />
                  ) : (
                    <span className="h-7 w-7 px-1 py-0.5 items-center justify-center rounded-full bg-zinc-500 text-white">
                      {getInitials(review.user?.fullname || "")}
                    </span>
                  )}
                  <span className="text-white">{review.user?.fullname || "User Anonim"}</span>
                </div>
                <span className="flex items-center gap-2 text-base font-medium text-white">
                  {[...Array(review.rating)].map((_, index) => (
                    <FaStar key={index} className="text-amber-500" size={15} />
                  ))}
                  {review.rating}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {review.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-500"
            >
              Sebelumnya
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="cursor-pointer rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-500"
            >
              Selanjutnya
            </button>
          </div>
        )}

        {/* Tombol Tutup di pojok kanan bawah */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

ReviewModal.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired, // Tambahkan properti rating
        user: PropTypes.shape({
          profile: PropTypes.shape({
            avatar_url: PropTypes.string,
            name: PropTypes.string,
          }),
        }).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewModal;
