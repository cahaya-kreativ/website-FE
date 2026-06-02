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
    if (authTokenValue) {
      getUserGoogleLogin();
    }
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

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-zinc-900 font-sans text-white selection:bg-amber-500 selection:text-white overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative min-h-screen bg-zinc-900 flex items-center">
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={Hero}
              alt="Hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-900/60 to-zinc-900" />
          </motion.div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:px-8 lg:px-12 flex justify-center lg:justify-end">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="w-full text-center lg:w-[60%] lg:text-right"
            >
              <motion.h1 variants={fadeUp} className="py-4 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-lg">
                Selamat Datang di Cahaya Kreativ
              </motion.h1>
              <motion.p variants={fadeUp} className="py-4 text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl ml-auto">
                Creative & technology company yang menghadirkan solusi inovatif melalui layanan dokumentasi, pengelolaan media sosial, dan pengembangan sistem IT terintegrasi.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col justify-center lg:justify-end gap-4 pt-10 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToSectionJasa}
                  className="group flex transform cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-500 bg-amber-500/10 px-6 py-3 text-base font-semibold text-amber-500 transition-all duration-300 hover:bg-amber-500 hover:text-zinc-900 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-1 md:text-lg"
                >
                  Jasa Kami
                  <MdCategory size={20} className="transition-transform group-hover:rotate-12" />
                </button>
                <button
                  type="button"
                  onClick={scrollToSectionGallery}
                  className="group flex transform cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-800/50 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-zinc-900 hover:-translate-y-1 md:text-lg"
                >
                  Gallery
                  <MdOutlinePermMedia size={20} className="transition-transform group-hover:scale-110" />
                </button>
                <button
                  type="button"
                  onClick={scrollToSectionChat}
                  className="group flex transform cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-800/50 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-zinc-900 hover:-translate-y-1 md:text-lg"
                >
                  Hubungi Kami
                  <BsChatDotsFill size={20} className="transition-transform group-hover:scale-110" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="relative min-h-screen bg-zinc-900 py-20 flex items-center">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 p-4 md:p-8 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] overflow-hidden rounded-3xl lg:h-[600px] group shadow-2xl shadow-black/50 border border-zinc-800"
            >
              <img
                src={"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"}
                alt="Our Team"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/90 via-zinc-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="inline-block rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 p-4 text-amber-400">
                  <p className="font-serif text-3xl font-bold">4+ Tahun</p>
                  <p className="text-sm font-medium">Pengalaman Kreatif</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col justify-center"
            >
              <motion.h2 variants={fadeUp} className="mb-8 font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                Tentang Cahaya Kreativ
              </motion.h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Visi Kami",
                    desc: "Menjadi mitra terpercaya dalam menghadirkan solusi kreatif yang inovatif dan berkualitas tinggi, serta memberikan dampak positif bagi klien dan masyarakat."
                  },
                  {
                    title: "Pendekatan Kami",
                    desc: "Kami memadukan kreativitas dengan pemikiran strategis untuk menghasilkan solusi yang tidak hanya menarik secara visual, tetapi juga memberikan dampak nyata bagi bisnis."
                  },
                  {
                    title: "Keahlian Kami",
                    desc: "Dengan pengalaman di bidang desain dan pengembangan digital, tim kami menghadirkan beragam keahlian untuk menciptakan pengalaman digital yang unggul di era kompetitif saat ini."
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeUp}
                    className="group relative rounded-2xl bg-zinc-800/30 p-6 border border-zinc-800 transition-all hover:bg-zinc-800/60 hover:border-zinc-700"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-amber-500 opacity-50 transition-opacity group-hover:opacity-100" />
                    <h3 className="mb-2 text-xl font-semibold text-amber-500 md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 md:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Why Us Section */}
        <div className="relative min-h-[60vh] bg-zinc-950 py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl mb-6">
                Kenapa Harus Cahaya Kreativ ?
              </h2>
              <p className="text-base text-gray-400 md:text-lg">
                Kami hadir bukan hanya untuk dokumentasi, tapi menciptakan kenangan yang tak terlupakan dengan pelayanan kelas satu.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { icon: FaTags, color: "text-rose-500", bg: "bg-rose-500/10", title: "Harga Kompetitif", desc: "Tidak ada biaya tersembunyi, dengan pilihan paket yang sesuai berbagai anggaran." },
                { icon: IoIosThumbsUp, color: "text-amber-500", bg: "bg-amber-500/10", title: "Layanan Fleksibel", desc: "Paket yang bisa disesuaikan dengan kebutuhan acara dan preferensi klien." },
                { icon: RiTeamFill, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Tim Profesional", desc: "Didukung tim kreatif yang berpengalaman dalam berbagai jenis proyek." },
                { icon: MdPermMedia, color: "text-blue-500", bg: "bg-blue-500/10", title: "Kualitas Premium", desc: "Hasil berkualitas tinggi, dikemas eksklusif dan siap digunakan." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-zinc-700"
                >
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Category / Layanan Jasa Section */}
        <div ref={sectionRef} className="relative min-h-[70vh] bg-zinc-900 py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl mb-6">
                Layanan Jasa Kami
              </h2>
              <p className="text-base text-gray-400 md:text-lg">
                Temukan layanan dokumentasi profesional, pengelolaan media sosial, dan solusi IT & software inovatif berkualitas tinggi untuk mendukung segala kebutuhan bisnis Anda.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
            >
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={fadeUp}
                    onClick={() => navigate(`/products?category=${category.name}`)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-800 border border-zinc-700 transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                      />
                    </div>
                    <div className="p-6 relative">
                      <div className="absolute right-6 top-0 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-zinc-900 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <FaArrowRight size={18} />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-zinc-700 rounded-2xl">
                  Tidak ada layanan jasa tersedia.
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Gallery Section */}
        <div ref={sectionRef2} className="min-h-screen bg-zinc-950 py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
            >
              <div className="max-w-2xl">
                <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  Gallery Kami
                </h2>
                <p className="text-base text-gray-400 md:text-lg">
                  Temukan berbagai karya visual kreatif yang telah kami hasilkan untuk klien-klien kami.
                </p>
              </div>
              <button
                onClick={() => navigate("/gallery?filter=all")}
                className="group flex items-center gap-2 text-base font-medium text-amber-500 transition-colors hover:text-amber-400"
              >
                Lihat Selengkapnya
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { title: "Graduation", filter: "graduation", matcher: (p) => p.name?.includes("Graduation") },
                { title: "Wedding", filter: "wedding", matcher: (p) => p.category?.name === "Documentation Independent" && p.name?.includes("Wedding") },
                { title: "Event", filter: "event", matcher: (p) => p.category?.name === "Documentation Event" },
                { title: "Social Media", filter: "sosmed", matcher: (p) => p.category?.name === "Social Media Management" },
                { title: "IT & Software", filter: "it_solution", matcher: (p) => p.category?.name === "IT Inovasi dan Solusi" }
              ].map((gal, idx) => {
                const product = Array.isArray(products) ? products.find(gal.matcher) : null;
                const imageSrc = product?.image || "https://via.placeholder.com/600x400";
                
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    onClick={() => navigate(`/gallery?filter=${gal.filter}`)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-1' : ''} h-[300px] md:h-[400px]`}
                  >
                    {product ? (
                      <img
                        src={imageSrc}
                        alt={gal.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-2xl font-serif font-bold text-white mb-2">{gal.title}</h3>
                      <div className="w-12 h-1 bg-amber-500 rounded-full transition-all duration-300 group-hover:w-24" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div ref={sectionRef3} className="relative py-32 bg-zinc-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={Contact}
              alt="Contact Background"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900" />
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-4xl px-4 text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-sm font-semibold tracking-wider uppercase">
              Mari Berkolaborasi
            </span>
            <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              Wujudkan Visual Impian Anda
            </h2>
            <p className="mb-10 text-lg text-gray-300 md:text-xl max-w-2xl mx-auto">
              Ingin solusi terbaik untuk kebutuhan visual Anda? Dapatkan konsultasi gratis sekarang! Tim kami siap memberikan pelayanan terbaik untuk Anda. 🔥
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-zinc-900 shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Mulai Konsultasi
                <BsChatDotsFill size={20} className="transition-transform group-hover:rotate-12" />
              </span>
              <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </motion.div>
        </div>

        {/* FAQ & Footer */}
        <div className="relative z-20 bg-zinc-950">
          <FAQ />
          <Footer />
        </div>
        
      </div>
    </>
  );
};
