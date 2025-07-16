import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Components
import { NavbarHome } from "../../../assets/components/navbar/NavbarHome";
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Redux
import { getGalleriesAction } from "../../../redux/action/admin/gallery/GetGalleryAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

export const Gallery = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  // Redux Store
  const authLoading = useSelector((state) => state.authLogin.loading);
  const galleries = useSelector((state) => state.getGalleries.galleries);

  // Token
  const token = CookieStorage.get(CookiesKeys.AuthToken);

  // Dinamis ambil dari gallery data
  const filters = useMemo(() => {
    if (!galleries || !Array.isArray(galleries))
      return [{ label: "All", value: "all" }];

    const categories = galleries.map((item) => item.category);
    const uniqueCategories = [...new Set(categories)].filter(Boolean);

    return [
      { label: "All", value: "all" },
      ...uniqueCategories.map((cat) => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat,
      })),
    ];
  }, [galleries]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterFromURL = searchParams.get("filter");

    if (filterFromURL && filters.some((f) => f.value === filterFromURL)) {
      setActiveFilter(filterFromURL);
    } else {
      setActiveFilter("all");
    }
  }, [location.search, filters]);

  // Filter items based on active filter
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return galleries;
    return galleries.filter((item) => item.category === activeFilter);
  }, [activeFilter, galleries]);

  useEffect(() => {
    dispatch(getGalleriesAction());
  }, [dispatch]);

  // State untuk loading gambar
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload semua gambar sebelum tampil
  useEffect(() => {
    if (!filteredItems || filteredItems.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;

    const imagePromises = filteredItems.map((item) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = item.image;
        img.onload = () => {
          loadedCount++;
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          resolve();
        };
      });
    });

    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        setImagesLoaded(true);
      }, 300); // Delay kecil agar transisi lebih smooth
    });
  }, [filteredItems]);

  if (authLoading || !imagesLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-16">
        <div className="container mx-auto pt-10 md:pt-16">
          {/* Judul Halaman */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-white">
              Gallery Cahaya Kreativ
            </h1>
            <p className="text-xl text-gray-300">
              Dokumentasi hasil karya kami dalam berbagai momen spesial
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex flex-wrap justify-center gap-3"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search);
                  if (filter.value === "all") {
                    searchParams.delete("filter");
                  } else {
                    searchParams.set("filter", filter.value);
                  }
                  navigate(`?${searchParams.toString()}`, { replace: true });
                }}
                className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                  activeFilter === filter.value
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-zinc-800 text-gray-300 shadow-sm hover:bg-zinc-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Galeri Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex min-w-[250px] flex-col items-center overflow-hidden rounded-lg bg-zinc-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={`Gallery ${item.id}`}
                        className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                        onClick={() => setSelectedImage(item.image)}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <p className="text-xl text-gray-300">
                    Tidak ada data dalam kategori ini
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

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
      </div>
      <Footer />
    </>
  );
};
