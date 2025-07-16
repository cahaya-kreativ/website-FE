import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Components
import { NavbarProfile } from "../../../assets/components/navbar/NavbarProfile";
import { SidebarAkun } from "../../../assets/components/sidebar/SidebarAkun";

// Icons
import { GoArrowLeft } from "react-icons/go";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Helper
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Redux Actions
import { changePass } from "../../../redux/action/user/profile/changePassAction";

export const UserPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "newPasswordConfirmation" ? "confirmPassword" : id]: value
    }));
  };

  const validateForm = () => {
    const { newPassword } = formData;
    
    if (newPassword.length < 8 || newPassword.length > 50) {
      return showErrorToast("Password must be between 8 and 50 characters long");
    }

    let counts = {
      upper: 0,
      lower: 0,
      digit: 0,
      special: 0
    };

    const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "[", "{", "]", "}", ":", ";", "<", ">", "."];

    for (let char of newPassword) {
      if (specialChars.includes(char)) {
        counts.special++;
      } else if (/\d/.test(char)) {
        counts.digit++;
      } else if (char === char.toUpperCase()) {
        counts.upper++;
      } else if (char === char.toLowerCase()) {
        counts.lower++;
      }
    }

    if (counts.lower === 0) return showErrorToast("Password must contain at least 1 lowercase");
    if (counts.upper === 0) return showErrorToast("Password must contain at least 1 uppercase");
    if (counts.digit === 0) return showErrorToast("Password must contain at least 1 digit number");
    if (counts.special === 0) return showErrorToast("Password must contain at least 1 symbol");

    handleSave();
  };

  const handleSave = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const success = await dispatch(
      changePass(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          newPasswordConfirmation: formData.confirmPassword,
        },
        token,
      ),
    );

    toast.dismiss(loadingToastId);

    if (success) {
      showSuccessToast("Your password has been successfully updated!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 pt-24 md:pb-0 lg:pb-8 md:px-8 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <div className="hidden md:flex items-center gap-4 mb-8">
            <GoArrowLeft
              size={30}
              onClick={() => navigate("/")}
              className="text-white cursor-pointer hover:text-amber-500 transition-colors duration-300"
            />
            <span className="text-xl font-bold text-white">Kembali Ke Beranda</span>
          </div>

          <div className="bg-zinc-800 backdrop-blur-sm rounded-xl border border-zinc-700">
            <div className="bg-zinc-900 rounded-t-xl py-4 px-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Profile</h2>
            </div>

            <div className="flex py-8">
              <SidebarAkun />
              <div className="flex w-full flex-col items-center gap-8 md:w-[60%]">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white"
                >
                  Ubah Password
                </motion.h2>

                <div className="w-full max-w-md space-y-6 px-4">
                  {[
                    { id: "oldPassword", label: "Password Lama", show: "old" },
                    { id: "newPassword", label: "Password Baru", show: "new" },
                    { id: "newPasswordConfirmation", label: "Konfirmasi Password Baru", show: "confirm" }
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <label className="text-white">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showPasswords[field.show] ? "text" : "password"}
                          id={field.id}
                          value={formData[field.id === "newPasswordConfirmation" ? "confirmPassword" : field.id]}
                          onChange={handleInput}
                          className="w-full rounded-xl bg-zinc-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.show)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {showPasswords[field.show] ? <FiEye size={20} className="cursor-pointer" /> : <FiEyeOff size={20} className="cursor-pointer"/>}
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={validateForm}
                    className="w-full rounded-xl cursor-pointer bg-amber-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Ubah Password
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