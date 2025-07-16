import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Redux Actions
import { getForgetPassAction } from "../../../redux/action/user/auth/getPasswordAction";

// Helper
import {
  showSuccessToast,
  showLoadingToast,
} from "../../../helper/ToastHelper";

// Icons
import { GoArrowLeft } from "react-icons/go";

export const ForgetPass = () => {
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSave = async () => {
    const loadingToastId = showLoadingToast("Loading ...");
    const forget = await dispatch(
      getForgetPassAction({
        email: Email,
      }),
    );
    toast.dismiss(loadingToastId);
    if (forget) {
      showSuccessToast(
        "Success Send Request Forget Password, Check your email or spam!",
      );
      setTimeout(() => {
        window.location.href = "https://mail.google.com";
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto w-full rounded-lg md:mt-0 md:max-w-md">
        <div className="mx-auto flex w-[22rem] flex-col lg:w-[30rem]">
          <div className="absolute top-[120px] cursor-pointer md:top-[350px] lg:top-[150px]">
            <GoArrowLeft
              size={25}
              className="items-center"
              onClick={() => {
                navigate("/login");
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="items-center py-2 text-4xl font-bold text-zinc-900">
              Lupa Password
            </span>

            {/* Konfirmasi Password Baru */}
            <div className="flex flex-col gap-2 py-4">
              <div className="flex justify-between">
                <span className="text-left text-lg">Email</span>
              </div>
              <div className="relative flex flex-col">
                <input
                  value={Email}
                  onChange={handleEmailChange}
                  placeholder="Masukkan Email"
                  className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-zinc-900 focus:outline-none"
                  type="email"
                />
              </div>
            </div>

            {/* Button Simpan */}
            <div className="flex flex-col py-6">
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-zinc-900 py-3 text-lg font-semibold text-white hover:bg-zinc-800"
                onClick={handleSave}
              >
                Masuk
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hidden h-screen w-2/5 items-center justify-center bg-zinc-900 md:flex lg:flex">
        <div className="flex items-center justify-center gap-6">
          {/* <img src={BrandLogo} alt="Brand Logo" className="w-[15%]" /> */}
          <span className="text-center font-serif text-6xl text-white">
            Cahaya Kreativ
          </span>
        </div>
      </div>
    </div>
  );
};
