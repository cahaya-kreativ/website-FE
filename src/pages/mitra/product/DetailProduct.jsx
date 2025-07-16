import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Pagination
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Components
import { NavbarHome } from "../../../assets/components/navbar/NavbarHome";
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Icons
import { TbCalendarTime, TbShoppingCartPlus } from "react-icons/tb";
import {
  FaStar,
  FaCheck,
  FaAngleRight,
  FaAngleLeft,
  FaImages,
  FaPlay,
  FaMinus,
} from "react-icons/fa";
import { FaRupiahSign } from "react-icons/fa6";
import { BiMessageDetail } from "react-icons/bi";

// Redux Actions
import { getGoogleLoginAction } from "../../../redux/action/user/auth/getGoogleLoginAction";
import {
  getDetailProductAction,
  getProductsAction,
} from "../../../redux/action/admin/products/getProductsAction";
import { getReviewsProductAction } from "../../../redux/action/user/reviews/getReviewProductAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

export const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [relatedPage, setRelatedPage] = useState(1);
  const itemsPerPage = 4; // Jumlah produk yang ditampilkan per halaman
  const [filter, setFilter] = useState(""); // null berarti semua rating
  const [active, setActive] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [fullImageUrl, setFullImageUrl] = useState(null); // State untuk menyimpan URL gambar penuh
  const [videoUrl, setVideoUrl] = useState(null); // State untuk menyimpan URL video
  const [showVideoModal, setShowVideoModal] = useState(false); // State untuk mengontrol tampilan modal video
  const [loadingPage, setLoadingPage] = useState(false);

  // Get Token from URL (Google)
  const token = CookieStorage.get(CookiesKeys.AuthToken);
  const urlParams = new URLSearchParams(location.search);
  const authTokenValue = urlParams.get("token");

  // Redux Store
  const authLoading = useSelector((state) => state.authLogin.loading);
  const product = useSelector((state) => state.getProducts.productDetail);
  const relatedProducts = useSelector((state) => state.getProducts.products);
  const reviews = useSelector((state) => state.getReviews.reviews);

  const fetchGetReviewsProduct = async (productId, page, filter = "") => {
    const result = await dispatch(
      getReviewsProductAction(productId, page, filter),
    );
    if (result) {
      setPagination(result.pagination);
    }
  };

  const handleRatingFilterChange = (filter) => {
    setFilter(filter);
    setActive(1); // Reset ke halaman pertama saat filter berubah
    fetchGetReviewsProduct(id, 1, filter);
  };

  // 1. Fetch detail product saat ID berubah
  useEffect(() => {
    if (!id) return;

    window.scrollTo(0, 0);
    setLoadingPage(true);
    setImageLoading(true);
    setCurrentImageIndex(0);

    const fetchData = async () => {
      await dispatch(getDetailProductAction(id));
      setLoadingPage(false);
    };

    fetchData();
    fetchGetReviewsProduct(id, active);
  }, [dispatch, id]);

  // 2. Fetch reviews saat active atau id berubah
  useEffect(() => {
    fetchGetReviewsProduct(id, active);
  }, [active, id]);

  // 3. Fetch related products saat kategori produk berubah
  useEffect(() => {
    if (product?.category?.id) {
      dispatch(getProductsAction({ categoryId: product.category.id }));
    }
  }, [dispatch, product?.category?.id]);

  // 4. Handle login otomatis dari token di URL
  useEffect(() => {
    if (authTokenValue) {
      dispatch(getGoogleLoginAction(authTokenValue));
    }
  }, [authTokenValue, dispatch]);

  // 5. Reset imageLoading saat thumbnail diganti
  useEffect(() => {
    if (currentImageIndex) {
      setImageLoading(true);
    }
  }, [currentImageIndex]);

  const handleImageNavigation = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === product?.images?.length - 1 ? 0 : prev + 1,
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product?.images?.length - 1 : prev - 1,
      );
    }
  };

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

  // Initial Avatar Profile
  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "";

    const names = fullName.trim().split(" ").filter(Boolean); // buang spasi kosong
    if (names.length === 0) return "";

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  };

  const getItemProps = (index) => ({
    className: `flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
      active === index
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
        : "text-white hover:text-zinc-900 hover:bg-white"
    }`,
    onClick: () => {
      setActive(index);
      fetchGetReviewsProduct(id, index);
    },
  });

  const renderPaginationButtons = () => {
    const totalPages = pagination.total_pages || 1;
    const buttons = [];
    let startPage = Math.max(active - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant="text"
          {...getItemProps(i)}
          disabled={i > totalPages}
        >
          {i}
        </Button>,
      );
    }
    return buttons;
  };

  const nextPage = () => {
    if (active < pagination.total_pages) {
      const next = active + 1;
      setActive(next);
      fetchGetReviewsProduct(id, next);
    }
  };

  const prevPage = () => {
    if (active > 1) {
      const prev = active - 1;
      setActive(prev);
      fetchGetReviewsProduct(id, prev);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleVideoThumbnailClick = (url) => {
    setVideoUrl(url); // Set URL video saat thumbnail diklik
    setShowVideoModal(true); // Tampilkan modal video
  };

  const handleImageClick = (url) => {
    setFullImageUrl(url); // Set URL gambar penuh saat gambar diklik
  };

  const totalRelatedPages = Math.ceil(
    relatedProducts.filter((p) => p.id !== product?.id).length / itemsPerPage,
  );

  const displayedRelatedProducts = relatedProducts
    .filter((p) => p.id !== product?.id)
    .slice((relatedPage - 1) * itemsPerPage, relatedPage * itemsPerPage);

  if (loadingPage || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}

      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="text-gray-400 transition-colors hover:text-amber-500"
                >
                  Home
                </a>
              </li>
              <span className="text-gray-400">/</span>
              <li>
                <a
                  href="/products"
                  className="text-gray-400 transition-colors hover:text-amber-500"
                >
                  Products
                </a>
              </li>
              <span className="text-gray-400">/</span>
              <li>
                <span className="text-amber-500">{product?.name}</span>
              </li>
            </ol>
          </motion.nav>

          {/* Product Detail Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="group relative overflow-hidden rounded-xl bg-zinc-800">
                <AnimatePresence mode="wait">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <LoadingSpinner />
                    </div>
                  )}
                  <motion.img
                    key={currentImageIndex}
                    src={product?.images?.[currentImageIndex] || product?.image}
                    alt={product?.name}
                    className={`h-[400px] w-full object-cover transition-transform duration-500 ${imageLoading ? "hidden" : "block"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onLoad={handleImageLoad}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product?.images?.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <FaAngleLeft className="text-white" size={24} />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <FaAngleRight className="text-white" size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Quick Info Below Image */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-zinc-800 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2">
                    <TbCalendarTime className="text-amber-500" size={20} />
                    <span className="font-medium text-white">
                      {formatDuration(product?.duration)}
                    </span>
                  </div>
                  <p className="mt-1 text-center text-sm text-gray-400">
                    Duration
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2">
                    <FaRupiahSign className="text-amber-500" size={20} />
                    <span className="font-medium text-white">
                      {product?.price}
                    </span>
                  </div>
                  <p className="mt-1 text-center text-sm text-gray-400">
                    Price
                  </p>
                </div>
              </div>

              {/* Portfolio Section */}
              {product?.portfolios && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <button
                    onClick={() => setShowPortfolioModal(true)}
                    className="group w-full cursor-pointer rounded-lg bg-zinc-800 p-4 backdrop-blur-sm transition-colors hover:bg-zinc-600"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <FaImages className="text-amber-500" size={24} />
                      <span className="font-medium text-white transition-colors group-hover:text-amber-500">
                        View Portfolio
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Thumbnail Navigation */}
              {product?.images?.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-amber-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <div className="mb-4">
                  <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                    {product?.name}
                  </h1>
                  <div className="flex gap-2">
                    <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-sm text-amber-500">
                      {product?.label}
                    </span>
                    <span className="rounded-xl bg-emerald-500/10 px-3 py-1 text-sm text-emerald-500">
                      {product?.category?.name}
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-300">
                  {product?.description}
                </p>
              </div>

              {/* Package Details */}
              <div className="mb-6 rounded-xl bg-zinc-800 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  Package Details
                </h3>
                <ul className="space-y-3">
                  {product?.detail?.map((item, index) => (
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <FaCheck className="text-amber-500" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Notes - Only show if notes exist */}
              {product?.note && product.note.length > 0 && (
                <div className="mb-6 rounded-xl bg-zinc-800 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Important Notes
                  </h3>
                  <ul className="space-y-3">
                    {product.note.map((item, index) => (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <FaCheck className="text-amber-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add On - Only show if Add On exist */}
              {product?.addOn && product.addOn.length > 0 && (
                <div className="mb-6 rounded-xl bg-zinc-800 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Add On (Optional)
                  </h3>
                  <ul className="space-y-3">
                    {product.addOn.map((item, index) => (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <FaMinus className="text-amber-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/order/${product.id}`)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-amber-600"
                >
                  <TbShoppingCartPlus size={20} />
                  Order Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/chat")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-zinc-600"
                >
                  <BiMessageDetail size={20} />
                  Hubungi Kami
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Related Products Section with Navigation */}
          {relatedProducts?.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Other Products
                </h2>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setRelatedPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={relatedPage === 1}
                    className={`rounded-full p-2 ${
                      relatedPage === 1
                        ? "cursor-not-allowed bg-zinc-700 text-gray-500"
                        : "cursor-pointer bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                    aria-label="Previous"
                  >
                    <FaAngleLeft size={18} />
                  </button>

                  <span className="text-white">
                    Page <strong>{relatedPage}</strong> of{" "}
                    <strong>{totalRelatedPages}</strong>
                  </span>

                  <button
                    onClick={() =>
                      setRelatedPage((prev) =>
                        Math.min(prev + 1, totalRelatedPages),
                      )
                    }
                    disabled={relatedPage === totalRelatedPages}
                    className={`rounded-full p-2 ${
                      relatedPage === totalRelatedPages
                        ? "cursor-not-allowed bg-zinc-700 text-gray-500"
                        : "cursor-pointer bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                    aria-label="Next"
                  >
                    <FaAngleRight size={18} />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {displayedRelatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-zinc-800"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-semibold text-white">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center justify-center gap-2 font-medium text-gray-300">
                          <FaRupiahSign className="text-amber-500" size={14} />
                          {relatedProduct.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-amber-500" size={14} />
                          <span className="text-sm text-gray-300">
                            {relatedProduct.averageRating || "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Customer Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-500" size={20} />
                <span className="text-lg font-semibold text-white">
                  {product?.averageRating || "0"}
                </span>
                <span className="text-gray-400">
                  ({product?.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Filter untuk ulasan */}
            <div className="mb-4 flex justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Filter by Rating:</span>
                <div className="flex space-x-1">
                  {/* Tombol All Ratings */}
                  <button
                    onClick={() => handleRatingFilterChange("")}
                    className={`flex cursor-pointer items-center justify-center rounded px-3 py-1 text-sm transition-colors ${
                      filter === ""
                        ? "bg-amber-500 text-white"
                        : "border bg-zinc-700 text-gray-300 hover:bg-amber-500"
                    }`}
                  >
                    All
                  </button>

                  {/* Tombol rating 1-5 */}
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingFilterChange(rating)}
                      className={`flex cursor-pointer items-center justify-center rounded px-3 py-1 text-sm transition-colors ${
                        filter === rating
                          ? "bg-amber-500 text-white"
                          : "border bg-zinc-700 text-gray-300 hover:bg-amber-500"
                      }`}
                    >
                      {rating} <FaStar className="ml-1" size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ulasan */}
            <div className="space-y-4">
              {reviews && reviews.reviews && reviews.reviews.length > 0 ? (
                reviews.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl bg-zinc-800 p-6 backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      {review.order.user?.profile?.avatar_url ? (
                        <img
                          src={review.order.user?.profile?.avatar_url}
                          alt="User Avatar"
                          className="h-8 w-8 rounded-full border-2 border-amber-500"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-black">
                          {getInitials(review.order.user?.fullname || "")}
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-white">
                          {review.order.user?.fullname}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? "text-amber-500"
                                    : "text-zinc-600"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">No reviews available.</p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="text"
                className="flex cursor-pointer items-center gap-2 text-white transition-transform duration-300 hover:scale-110"
                onClick={prevPage}
                disabled={active === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-2">
                {renderPaginationButtons()}
              </div>
              <Button
                variant="text"
                className="flex cursor-pointer items-center gap-2 text-white transition-transform duration-300 hover:scale-110"
                onClick={nextPage}
                disabled={active === pagination.total_pages}
              >
                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Portfolio Modal */}
        <AnimatePresence>
          {showPortfolioModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => {
                setShowPortfolioModal(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-zinc-800 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">
                    Portfolio {product?.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPortfolioModal(false);
                    }}
                    className="cursor-pointer text-gray-400 transition-colors hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product?.portfolios?.[0]?.media?.map((media, index) => (
                    <motion.div
                      key={media.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group relative overflow-hidden rounded-lg ${
                        media.type === "VIDEO" ? "bg-gray-500" : ""
                      }`}
                    >
                      {media.type === "IMAGE" ? (
                        <img
                          src={media.url}
                          alt={`Portfolio ${index + 1}`}
                          className="h-64 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                          onClick={() => handleImageClick(media.url)}
                        />
                      ) : media.type === "VIDEO" ? (
                        <div className="bg-bg-gray-500 relative flex h-64 items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoThumbnailClick(media.url);
                            }}
                            className="absolute flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 transition-colors hover:bg-slate-300"
                          >
                            <FaPlay className="h-8 w-8" />
                          </button>
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </div>

                {/* Full Image Modal */}
                {fullImageUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
                    onClick={() => setFullImageUrl(null)}
                  >
                    <img
                      src={fullImageUrl}
                      alt="Full View"
                      className="max-h-full max-w-full object-contain"
                    />
                  </motion.div>
                )}

                {/* Empty State */}
                {(!product?.portfolios?.[0]?.media ||
                  product?.portfolios?.[0]?.media?.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-zinc-700/50 p-4">
                      <FaImages className="h-12 w-12 text-amber-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Belum Ada Portfolio
                    </h4>
                    <p className="mt-2 text-gray-400">
                      Produk ini belum memiliki portfolio yang tersedia
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
              onClick={() => setShowVideoModal(false)}
            >
              <div className="relative mx-4 w-full max-w-4xl">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="absolute top-2 right-2 z-10 cursor-pointer text-2xl text-white"
                >
                  ✕
                </button>
                <iframe
                  src={videoUrl}
                  title="Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full rounded-lg"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
};
