import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Components
import { NavbarProfile } from "../../../assets/components/navbar/NavbarProfile";
import { SidebarAkun } from "../../../assets/components/sidebar/SidebarAkun";

// Helper
import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Icons
import { GoArrowLeft } from "react-icons/go";
import { FaCamera } from "react-icons/fa";

// Redux Action
import {
  getUserProfileAction,
  putUpdateProfile,
} from "../../../redux/action/user/profile/profileUserAction";

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Data = useSelector((state) => state.authLogin);

  const [image, setImage] = useState(null);
  const [newFullName, setNewFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  useEffect(() => {
    if (Data.user) {
      setNewFullName(Data.user.fullname || "");
      setEmail(Data.user.email || "");
      setNewPhoneNumber(Data.user.phoneNumber || "");
      setNewDate(Data.userProfile?.birth_date || "");
      setNewAddress(Data.userProfile?.address || "");
      setNewCity(Data.userProfile?.city || "");
    }
  }, [Data]);

  const handleInput = (e, setter) => {
    setter(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSave = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const formData = new FormData();
    formData.append("avatar_url", image);
    formData.append("fullname", newFullName);
    formData.append("email", email);
    formData.append("phoneNumber", newPhoneNumber);
    formData.append("birth_date", newDate);
    formData.append("address", newAddress);
    formData.append("city", newCity);

    const update = await dispatch(putUpdateProfile(formData));

    toast.dismiss(loadingToastId);

    if (update) {
      showSuccessToast("Profile updated successfully!");
      dispatch(getUserProfileAction());
    }
  };

  // Date Time Picker
  const dateTimeLocalNow = new Date().toISOString().slice(0, 10);

  // Initial Avatar Profile
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const initials = names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1); /* Putih */
          cursor: pointer;
        }
        input[type="date"]:hover {
          background-color: #3f3f46; /* Tailwind zinc-700 */
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 pt-24 md:px-8 md:py-32 md:pb-0 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <div className="mb-8 hidden items-center gap-4 md:flex">
            <GoArrowLeft
              size={30}
              onClick={() => navigate("/")}
              className="cursor-pointer text-white transition-colors duration-300 hover:text-amber-500"
            />
            <span className="text-xl font-bold text-white">
              Kembali Ke Beranda
            </span>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800 backdrop-blur-sm">
            <div className="rounded-t-xl border-b border-zinc-700 bg-zinc-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Profile</h2>
            </div>

            <div className="flex py-8">
              <SidebarAkun />
              <div className="flex w-full flex-col items-center gap-6 md:w-[60%]">
                <motion.div
                  className="relative"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-3 border-amber-500">
                    <input
                      type="file"
                      id="avatar_url"
                      accept="image/*"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      onChange={handleImageUpload}
                    />
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : Data?.userProfile?.avatar_url ? (
                      <img
                        src={Data.userProfile.avatar_url}
                        alt="User Avatar"
                        className="h-full w-full border-2 border-amber-500 object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-amber-500 text-5xl font-bold text-white">
                        {getInitials(Data?.user?.fullname)}
                      </div>
                    )}
                  </div>
                  {imageHover && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                      <FaCamera className="text-2xl text-white" />
                    </div>
                  )}
                </motion.div>

                <div className="w-full max-w-md space-y-6 px-4">
                  {/* Nama */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Nama</label>
                    <input
                      type="text"
                      id="fullname"
                      value={newFullName}
                      onChange={(e) => handleInput(e, setNewFullName)}
                      className="w-full appearance-none rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      disabled={true}
                      className="w-full cursor-not-allowed appearance-none rounded-xl bg-zinc-600 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </motion.div>

                  {/* Nomor Telepon */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Nomor Telepon</label>
                    <input
                      type="tel"
                      id="phone"
                      value={newPhoneNumber}
                      onChange={(e) => handleInput(e, setNewPhoneNumber)}
                      className="w-full appearance-none rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </motion.div>

                  {/* Tanggal Lahir */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Tanggal Lahir</label>
                    <input
                      type="date"
                      id="birth_date"
                      value={newDate}
                      onChange={(e) => handleInput(e, setNewDate)}
                      max={dateTimeLocalNow}
                      className="w-full cursor-text appearance-none rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </motion.div>

                  {/* Alamat */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Alamat</label>
                    <textarea
                      id="address"
                      value={newAddress}
                      onChange={(e) => handleInput(e, setNewAddress)}
                      className="w-full rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      rows="4"
                    />
                  </motion.div>

                  {/* Kota */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-white">Kota</label>
                    <input
                      type="text"
                      id="city"
                      value={newCity}
                      onChange={(e) => handleInput(e, setNewCity)}
                      className="w-full appearance-none rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleSave}
                    className="w-full cursor-pointer rounded-xl bg-amber-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Simpan Profil
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {<NavbarProfile style={{ zIndex: 1 }} />}
    </>
  );
};
