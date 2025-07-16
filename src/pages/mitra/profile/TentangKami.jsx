import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import { NavbarHome } from "../../../assets/components/navbar/NavbarHome";
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Redux Actions
import { getGoogleLoginAction } from "../../../redux/action/user/auth/getGoogleLoginAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

// Icons
import { FaCamera, FaVideo, FaLightbulb, FaPencilAlt } from "react-icons/fa";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";
import { BsChatDotsFill } from "react-icons/bs";

export const TentangKami = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get Token from URL (Google)
  const token = CookieStorage.get(CookiesKeys.AuthToken);
  const urlParams = new URLSearchParams(location.search);
  const authTokenValue = urlParams.get("token");

  // Redux Store
  const loading = useSelector((state) => state.authLogin.loading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (authTokenValue) {
      dispatch(getGoogleLoginAction(authTokenValue));
    }
  }, [authTokenValue, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const teamMembers = [
    {
      id: 1,
      name: "Ghifarry Rachmadhan",
      role: "Leader",
      image:
        "https://ik.imagekit.io/cahayakreativ/Foto%20Mitra/IMG_3306.jpg?updatedAt=1748442595216",
      quote:
        "Setiap momen adalah kesempatan untuk menciptakan kenangan yang abadi.",
      expertise: ["Brand Strategy", "Creative Direction", "Content Planning"],
      icon: <FaCamera className="text-amber-500" size={24} />,
    },
    {
      id: 2,
      name: "Ekky Yudha Perkasa",
      role: "Co-Leader",
      image:
        "https://ik.imagekit.io/cahayakreativ/Foto%20Mitra/IMG_3315.jpg?updatedAt=1748442594336",
      quote:
        "Video adalah cara terbaik untuk menceritakan sebuah kisah yang berkesan.",
      expertise: ["Wedding Cinematography", "Corporate Videos", "Music Videos"],
      icon: <FaVideo className="text-amber-500" size={24} />,
    },
    {
      id: 3,
      name: "Abrar Azizi",
      role: "Documentation",
      image:
        "https://ik.imagekit.io/cahayakreativ/Foto%20Mitra/IMG_3318.jpg?updatedAt=1748442594992",
      quote: "Kreativitas adalah kunci untuk menghasilkan karya yang berbeda.",
      expertise: ["Wedding Photography", "Portrait", "Event Documentation"],
      icon: <FaLightbulb className="text-amber-500" size={24} />,
    },
    {
      id: 4,
      name: "Wisnu Mukti D.",
      role: "Administration",
      image:
        "https://ik.imagekit.io/cahayakreativ/Foto%20Mitra/IMG_3326.jpg?updatedAt=1748442594610",
      quote: "Konten yang baik adalah perpaduan antara seni dan strategi.",
      expertise: ["Content Creation", "Social Media", "Copywriting"],
      icon: <FaPencilAlt className="text-amber-500" size={24} />,
    },
  ];

  return (
    <>
      {!token ? <NavbarHome /> : <NavbarLogin style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-zinc-900">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 to-zinc-900" />
            <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                  Tentang Kami
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-300">
                  Kami adalah tim kreatif yang berdedikasi untuk menghadirkan
                  solusi visual terbaik bagi setiap klien kami.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="mx-auto mt-8 flex transform cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent px-6 py-3 text-base font-semibold text-white transition duration-300 hover:scale-110 md:text-lg"
                >
                  Hubungi Kami
                  <BsChatDotsFill size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-zinc-800 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 md:grid-cols-2">
                <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[400px]">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                    alt="Our Team"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
                </div>
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
                    Cahaya Kreativ Studio
                  </h2>
                  <p className="text-gray-300">
                    Didirikan pada tahun 2021, Cahaya Kreativ Studio telah
                    berkembang menjadi salah satu studio kreatif terkemuka di
                    Indonesia. Kami menggabungkan keahlian teknis dengan visi
                    artistik untuk menciptakan konten visual yang memukau dan
                    bermakna.
                  </p>
                  <p className="text-gray-300">
                    Dengan tim profesional yang berpengalaman dan peralatan
                    berteknologi tinggi, kami berkomitmen untuk memberikan hasil
                    terbaik dalam setiap proyek. Fokus kami adalah menciptakan
                    hubungan jangka panjang dengan klien melalui layanan yang
                    personal dan berkualitas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
                  Visi Kami
                </h2>
                <p className="text-gray-300">
                  Menjadi mitra terpercaya dalam menghadirkan solusi kreatif
                  yang inovatif dan berkualitas tinggi, serta memberikan dampak
                  positif bagi klien dan masyarakat.
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
                  Misi Kami
                </h2>
                <ul className="list-inside list-disc space-y-3 text-gray-300">
                  <li>
                    Menghadirkan layanan dokumentasi profesional berkualitas
                    tinggi
                  </li>
                  <li>
                    Memberikan pengalaman pelanggan yang personal dan memuaskan
                  </li>
                  <li>
                    Terus berinovasi dalam teknik dan teknologi dokumentasi
                  </li>
                  <li>Membangun hubungan jangka panjang dengan setiap klien</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-zinc-800 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
                Creative Founders
              </h2>
              <p className="mt-4 text-gray-300">
                Berkenalan dengan para profesional kreatif di balik setiap
                proyek kami
              </p>
            </div>

            {/* Profile Team */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative h-[600px] transform overflow-hidden rounded-xl bg-zinc-900 transition duration-300 hover:scale-105"
                >
                  <div className="relative h-[250px]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  </div>
                  <div className="relative space-y-2 p-4">
                    <div className="flex items-center gap-3">
                      {member.icon}
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                    </div>
                    <p className="text-amber-500">{member.role}</p>
                    <div className="relative flex min-h-[100px] items-center justify-center px-4 py-2 text-center">
                      <BiSolidQuoteAltLeft
                        className="absolute top-0 left-0 text-amber-500/30"
                        size={20}
                      />
                      <p className="z-10 text-sm text-gray-300">
                        {member.quote}
                      </p>
                      <BiSolidQuoteAltRight
                        className="absolute right-0 bottom-0 text-amber-500/30"
                        size={20}
                      />
                    </div>
                    <div className="pt-4">
                      <p className="mb-2 text-sm font-semibold text-white">
                        Keahlian:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-500"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 md:text-5xl">
                  4+
                </div>
                <div className="mt-2 text-sm text-gray-300 md:text-base">
                  Tahun Pengalaman
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 md:text-5xl">
                  50+
                </div>
                <div className="mt-2 text-sm text-gray-300 md:text-base">
                  Proyek Selesai
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 md:text-5xl">
                  50+
                </div>
                <div className="mt-2 text-sm text-gray-300 md:text-base">
                  Klien Puas
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 md:text-5xl">
                  4.9
                </div>
                <div className="mt-2 text-sm text-gray-300 md:text-base">
                  Rating Klien
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};
