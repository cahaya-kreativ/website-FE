import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Images
import Hero from "../assets/img/Hero.jpg";
import Contact from "../assets/img/Team Mitra.jpeg";

// Components
import { NavbarHome } from "../assets/components/navbar/NavbarHome";
import { NavbarLogin } from "../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../assets/components/loading/LoadingSpinner";
import { Footer } from "../assets/components/footer/Footer";
import FAQ from "../assets/components/footer/FAQ";

// Redux Actions
import { getGoogleLoginAction } from "../redux/action/user/auth/getGoogleLoginAction";
import { getCategoriesAction } from "../redux/action/admin/categories/getCategoriesAction";
import { getProductsAction } from "../redux/action/admin/products/getProductsAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../utils/cookie";

// Icons
import { BsChatDotsFill } from "react-icons/bs";
import { MdCategory } from "react-icons/md";
import { MdOutlinePermMedia } from "react-icons/md";
import { IoIosThumbsUp } from "react-icons/io";
import { FaTags } from "react-icons/fa6";
import { RiTeamFill } from "react-icons/ri";
import { MdPermMedia } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

export const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const sectionRef = useRef(null);
  const sectionRef2 = useRef(null);
  const sectionRef3 = useRef(null);

  const token = CookieStorage.get(CookiesKeys.AuthToken);
  // const user = useSelector((state) => state.authLogin)
  // console.log("user", user)
  // Redux Store
  const loading = useSelector((state) => state.authLogin.loading);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.getCategories,
  );
  const { products, loading: productsLoading } = useSelector(
    (state) => state.getProducts,
  );

  // Get Token from URL (Google)
  const urlParams = new URLSearchParams(location.search);
  const authTokenValue = urlParams.get("token");

  const getUserGoogleLogin = () => {
    dispatch(getGoogleLoginAction(authTokenValue));
  };

  const getCategories = () => {
    dispatch(getCategoriesAction());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getCategories();
    dispatch(getProductsAction());
    getUserGoogleLogin();
  }, [dispatch]);

  const scrollToSectionJasa = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSectionGallery = () => {
    if (sectionRef2.current) {
      sectionRef2.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSectionChat = () => {
    if (sectionRef3.current) {
      sectionRef3.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || categoriesLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-zinc-900">
        {/* Hero Section*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative min-h-screen">
            <img
              src={Hero}
              alt="Hero"
              className="absolute inset-0 z-0 h-full w-full object-cover pt-20 opacity-20"
            />
            <div className="absolute inset-0 z-10" />
            <div className="relative z-20 flex h-full items-center justify-center px-4 py-20 text-white md:px-8 md:py-96 lg:justify-end lg:px-24 lg:py-60">
              <div className="w-full p-4 text-center lg:w-[49%]">
                <h1 className="py-4 font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                  Selamat Datang di Cahaya Kreativ
                </h1>
                <p className="py-4 text-base md:text-lg">
                  Perusahaan jasa kreatif yang mengutamakan kualitas dalam
                  layanan dokumentasi untuk berbagai acara penting.
                </p>
                <div className="flex flex-col justify-evenly gap-4 pt-10 md:flex-row md:gap-0">
                  <button
                    type="button"
                    onClick={scrollToSectionJasa}
                    className="flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent p-4 text-base font-semibold text-white transition duration-300 hover:scale-110 md:text-lg"
                  >
                    Jasa Kami
                    <MdCategory size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={scrollToSectionGallery}
                    className="flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent p-4 text-base font-semibold text-white transition duration-300 hover:scale-110 md:text-lg"
                  >
                    Gallery
                    <MdOutlinePermMedia size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={scrollToSectionChat}
                    className="flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent p-4 text-base font-semibold text-white transition duration-300 hover:scale-110 md:text-lg"
                  >
                    Hubungi Kami
                    <BsChatDotsFill size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Section About Us */}
        <div className="min-h-screen bg-zinc-900">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-4 pt-12 md:gap-12 md:p-8 md:pt-24 lg:grid-cols-2">
            {/* Left Side - Image */}
            <div className="relative h-[300px] overflow-hidden rounded-2xl md:h-[400px] lg:h-[600px]">
              <img
                src={
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                }
                alt="Our Team"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center text-white lg:pl-12">
              <h2 className="mb-6 font-serif text-3xl font-bold md:mb-8 md:text-4xl">
                Tentang Cahaya Kreativ
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
                  <h3 className="mb-2 text-xl font-semibold md:mb-3 md:text-2xl">
                    Visi Kami
                  </h3>
                  <p className="text-sm text-gray-300 md:text-base">
                    Menjadi mitra terpercaya dalam menghadirkan solusi kreatif
                    yang inovatif dan berkualitas tinggi, serta memberikan
                    dampak positif bagi klien dan masyarakat.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
                  <h3 className="mb-2 text-xl font-semibold md:mb-3 md:text-2xl">
                    Pendekatan Kami
                  </h3>
                  <p className="text-sm text-gray-300 md:text-base">
                    Kami memadukan kreativitas dengan pemikiran strategis untuk
                    menghasilkan solusi yang tidak hanya menarik secara visual,
                    tetapi juga memberikan dampak nyata bagi bisnis. Proses
                    kolaboratif kami memastikan setiap proyek dirancang sesuai
                    kebutuhan unik klien.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
                  <h3 className="mb-2 text-xl font-semibold md:mb-3 md:text-2xl">
                    Keahlian Kami
                  </h3>
                  <p className="text-sm text-gray-300 md:text-base">
                    Dengan pengalaman lebih dari empat tahun di bidang desain
                    dan pengembangan digital, tim kami menghadirkan beragam
                    keahlian dan perspektif untuk menciptakan pengalaman digital
                    yang unggul dan relevan di era kompetitif saat ini.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:mt-4 md:gap-6">
                <div className="text-center">
                  <span className="text-3xl font-bold text-amber-500 md:text-4xl">
                    4+
                  </span>
                  <p className="mt-2 text-xs text-gray-300 md:text-sm">
                    Tahun Pengalaman
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-amber-500 md:text-4xl">
                    50+
                  </span>
                  <p className="mt-2 text-xs text-gray-300 md:text-sm">
                    Proyek Selesai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Why Us */}
        <div className="relative min-h-[60vh] bg-zinc-800 py-12 md:py-16">
          <div className="relative z-0 flex h-full flex-col items-center justify-center rounded-xl px-4 text-white md:px-8">
            <h2 className="text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
              Kenapa Harus Cahaya Kreativ ?
            </h2>
            <span className="px-4 py-4 text-center text-base md:px-20 md:py-8 md:text-xl lg:px-40">
              Kami hadir bukan hanya untuk dokumentasi, tapi menciptakan
              kenangan yang tak terlupakan.
            </span>
            {/* Konten Utama */}
            <div className="grid grid-cols-1 gap-6 px-4 pt-8 md:grid-cols-2 md:gap-8 md:px-12 md:pt-10 lg:grid-cols-4 lg:px-20">
              <div className="transform rounded-xl bg-zinc-800 p-4 text-center text-white shadow-2xl/50 inset-shadow-sm inset-shadow-zinc-700 transition duration-300 hover:scale-105">
                <FaTags className="mx-auto mb-4 h-8 w-8 text-red-500 md:h-10 md:w-10" />
                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                  Harga Kompetitif
                </h3>
                <p className="text-sm text-gray-400 md:text-base">
                  Tidak ada biaya tersembunyi, dengan pilihan paket yang sesuai
                  berbagai anggaran tanpa mengorbankan kualitas.
                </p>
              </div>

              <div className="transform rounded-xl bg-zinc-800 p-4 text-center text-white shadow-2xl/50 inset-shadow-sm inset-shadow-zinc-700 transition duration-300 hover:scale-105">
                <IoIosThumbsUp className="mx-auto mb-4 h-8 w-8 text-amber-500 md:h-10 md:w-10" />
                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                  Layanan Fleksibel & Personal
                </h3>
                <p className="text-sm text-gray-400 md:text-base">
                  Paket yang bisa disesuaikan dengan kebutuhan acara dan
                  preferensi klien, dengan komunikasi yang responsif.
                </p>
              </div>

              <div className="transform rounded-xl bg-zinc-800 p-4 text-center text-white shadow-2xl/50 inset-shadow-sm inset-shadow-zinc-700 transition duration-300 hover:scale-105">
                <RiTeamFill className="mx-auto mb-4 h-8 w-8 text-green-500 md:h-10 md:w-10" />
                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                  Tim Profesional
                </h3>
                <p className="text-sm text-gray-400 md:text-base">
                  Didukung fotografer, videografer, dan tim kreatif yang
                  berpengalaman dalam berbagai jenis proyek.
                </p>
              </div>

              <div className="transform rounded-xl bg-zinc-800 p-4 text-center text-white shadow-2xl/50 inset-shadow-sm inset-shadow-zinc-700 transition duration-300 hover:scale-105">
                <MdPermMedia className="mx-auto mb-4 h-8 w-8 text-blue-500 md:h-10 md:w-10" />
                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                  Kualitas Hasil Premium
                </h3>
                <p className="text-sm text-gray-400 md:text-base">
                  Hasil foto dan video berkualitas tinggi, dikemas eksklusif dan
                  siap digunakan untuk berbagai keperluan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Category */}
        <div
          ref={sectionRef}
          className="relative min-h-[70vh] bg-zinc-900 py-12 md:py-24"
        >
          <div className="relative z-0 flex h-full flex-col items-center justify-center px-4 text-white md:px-8">
            <h2 className="text-center font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
              Layanan Jasa Kami
            </h2>
            <span className="py-6 text-center text-base md:py-10 md:text-xl">
              Temukan pengalaman dokumentasi terbaik dengan layanan profesional
              dan hasil berkualitas tinggi.
            </span>
            <div className="w-full p-4 md:w-[90%] lg:w-[80%]">
              {/* Kotak utama */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="transform cursor-pointer rounded-xl p-4 text-center text-white shadow-2xl/50 inset-shadow-sm inset-shadow-zinc-700 transition duration-300 hover:scale-105"
                      onClick={() => {
                        navigate(`/products?category=${category.name}`);
                      }}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="mx-auto mb-2 h-32 w-40 object-cover md:h-40 md:w-48"
                      />
                      <div className="py-2 text-base font-semibold md:text-lg">
                        {category.name}
                      </div>
                      <div className="text-xs md:text-sm">
                        {category.description}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full cursor-default p-2 text-center text-gray-500">
                    Tidak ada layanan jasa tersedia.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Gallery */}
        <div
          ref={sectionRef2}
          className="min-h-screen bg-zinc-800 py-12 md:min-h-[50vh] md:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12 text-left md:mb-12">
              <div className="flex justify-between">
                <h2 className="mb-4 font-serif text-3xl font-bold text-white md:mb-6 md:text-4xl">
                  Gallery Kami
                </h2>
                <p
                  className="flex cursor-pointer items-center justify-center gap-2 text-lg text-white transition-all duration-300 hover:text-amber-500"
                  onClick={() => navigate("/gallery?filter=all")}
                >
                  Lihat Selengkapnya
                  <FaArrowRight
                    size={20}
                    className="hidden transform transition-transform duration-300 group-hover:translate-x-2 md:block"
                  />
                </p>
              </div>
              <p className="max-w-3xl text-base text-gray-300 md:text-xl">
                Temukan berbagai solusi kreatif yang disesuaikan dengan
                kebutuhan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {/* CARD GRADUATION */}
              <div
                className="group relative h-64 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 md:h-80"
                onClick={() => navigate("/gallery?filter=graduation")}
              >
                {Array.isArray(products) &&
                products.find((p) => p.name?.includes("Graduation")) ? (
                  <img
                    src={
                      products.find((p) => p.name?.includes("Graduation"))
                        ?.image || "https://via.placeholder.com/600x400 "
                    }
                    alt="Graduation"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-white">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">
                    Graduation
                  </h3>
                </div>
              </div>

              {/* CARD WEDDING */}
              <div
                className="group relative h-64 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 md:h-80"
                onClick={() => navigate("/gallery?filter=wedding")}
              >
                {Array.isArray(products) &&
                products.find(
                  (p) =>
                    p.category?.name === "Documentation Independent" &&
                    p.name?.includes("Wedding"),
                ) ? (
                  <img
                    src={
                      products.find(
                        (p) =>
                          p.category?.name === "Documentation Independent" &&
                          p.name?.includes("Wedding"),
                      )?.image || "https://via.placeholder.com/600x400 "
                    }
                    alt="Wedding"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-white">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">Wedding</h3>
                </div>
              </div>

              {/* CARD EVENT */}
              <div
                className="group relative h-64 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 md:h-80"
                onClick={() => navigate("/gallery?filter=event")}
              >
                {Array.isArray(products) &&
                products.find(
                  (p) => p.category?.name === "Documentation Event",
                ) ? (
                  <img
                    src={
                      products.find(
                        (p) => p.category?.name === "Documentation Event",
                      )?.image || "https://via.placeholder.com/600x400 "
                    }
                    alt="Event"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-white">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">Event</h3>
                </div>
              </div>

              {/* CARD SOCIAL MEDIA */}
              <div
                className="group relative h-64 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-105 md:h-80"
                onClick={() => navigate("/gallery?filter=sosmed")}
              >
                {Array.isArray(products) &&
                products.find(
                  (p) => p.category?.name === "Social Media Management",
                ) ? (
                  <img
                    src={
                      products.find(
                        (p) => p.category?.name === "Social Media Management",
                      )?.image || "https://via.placeholder.com/600x400 "
                    }
                    alt="Social Media"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-white">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">
                    Social Media
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Kontak */}
        <div
          ref={sectionRef3}
          className="flex h-[50vh] items-center justify-center md:h-[80vh]"
        >
          <div className="relative h-full w-full md:h-[75%] md:w-[80%]">
            <img
              src={Contact}
              alt="Contact"
              className="absolute inset-0 z-0 h-full w-full transform overflow-hidden rounded-2xl object-cover opacity-30"
            />
            <div className="absolute inset-0 z-10" />
            <div className="relative z-20 flex h-full items-center justify-center px-4 py-12 md:px-12 md:py-16 lg:px-20">
              <div className="w-full text-center md:w-[70%] lg:w-[50%]">
                <h1 className="py-4 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  Hubungi Kami
                </h1>
                <p className="py-4 text-base text-white md:text-lg">
                  Ingin solusi terbaik untuk kebutuhan visual Anda? Dapatkan
                  konsultasi gratis sekarang! Tim kami siap memberikan pelayanan
                  terbaik untuk Anda. 🔥
                </p>
                <div className="flex justify-center pt-6 md:pt-10">
                  <button
                    type="button"
                    onClick={() => navigate("/chat")}
                    className="flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent p-4 text-base font-semibold text-white transition duration-300 hover:scale-110 md:text-lg"
                  >
                    Hubungi Kami
                    <BsChatDotsFill size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section FAQ */}
        <FAQ />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};
