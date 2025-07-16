import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import { NavbarHome } from "../../../assets/components/navbar/NavbarHome";
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Icons
import { TbCalendarTime } from "react-icons/tb";
import { FaRupiahSign } from "react-icons/fa6";
import { FaStar, FaSearch } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";

// Redux Actions
import { getGoogleLoginAction } from "../../../redux/action/user/auth/getGoogleLoginAction";
import {
  getProductsAction,
  getDetailProductAction,
} from "../../../redux/action/admin/products/getProductsAction";
import { getCategoriesAction } from "../../../redux/action/admin/categories/getCategoriesAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

export const Product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isHovered, setIsHovered] = useState(null);

  // Get Token from URL (Google)
  const token = CookieStorage.get(CookiesKeys.AuthToken);
  const urlParams = new URLSearchParams(location.search);
  const authTokenValue = urlParams.get("token");

  // Redux Store
  const authLoading = useSelector((state) => state.authLogin.loading);
  const { categories } = useSelector((state) => state.getCategories);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.getProducts,
  );

  // Categories
  const categoryList = ["All", ...(categories || []).map((cat) => cat.name)];
  const categoryQuery = urlParams.get("category");

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
  }, [categoryQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (authTokenValue) {
      dispatch(getGoogleLoginAction(authTokenValue));
    }
  }, [authTokenValue, dispatch]);

  useEffect(() => {
    dispatch(getProductsAction());
    dispatch(getCategoriesAction());
  }, [dispatch]);

  if (authLoading || productsLoading) {
    return <LoadingSpinner />;
  }

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

  // Filter products based on search and category
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-24">
          {/* Hero Section with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center md:mb-16"
          >
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:mb-6 md:text-5xl">
              Produk Kami
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-300 md:text-xl">
              Temukan berbagai pilihan produk unggulan kami yang siap mendukung
              kebutuhan kreatif Anda. Jelajahi katalog lengkap dan dapatkan
              produk terbaik dengan mudah dan cepat!
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 md:max-w-md">
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-zinc-800 py-3 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <IoFilterSharp className="text-amber-500" size={20} />

                {/* Mobile Dropdown */}
                {isMobile ? (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-xl bg-zinc-800 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {categoryList.map((category) => (
                      <option key={category} value={category} className="py-2">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Desktop Buttons
                  <div className="flex flex-wrap gap-2">
                    {categoryList.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-amber-500 text-white"
                            : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative transform cursor-pointer overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-zinc-900"
                onMouseEnter={() => setIsHovered(product.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div
                  className="aspect-w-16 aspect-h-9 relative overflow-hidden"
                  onClick={() => {
                    dispatch(getDetailProductAction(product.id));
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full transform object-cover transition-transform duration-300 group-hover:scale-110 md:h-56"
                  />
                  {isHovered === product.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300">
                      <button className="cursor-pointer rounded-xl bg-amber-500 px-6 py-2 font-medium text-white transition-transform duration-300 hover:scale-105">
                        Lihat Detail
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-amber-500" />
                      <span className="text-white">
                        {product.averageRating || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-sm text-amber-500">
                      {product.label}
                    </span>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm text-gray-300">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                    <div className="flex items-center gap-2 text-white">
                      <FaRupiahSign className="text-amber-500" />
                      <span>{product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <TbCalendarTime className="text-amber-500" />
                      <span>{formatDuration(product.duration)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="rounded-xl bg-zinc-800 p-8">
                <p className="text-xl text-gray-300">
                  Tidak ada produk yang sesuai dengan pencarian Anda.
                </p>
              </div>
            </motion.div>
          )}
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};
