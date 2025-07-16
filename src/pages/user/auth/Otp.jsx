import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Redux Actions
import {
  getResendOtp,
  otpAction,
} from "../../../redux/action/user/auth/otpAction";

// Helper
import {
  showSuccessToast,
  showLoadingToast,
} from "../../../helper/ToastHelper";

export const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const emailParam = new URLSearchParams(location.search).get("email");
  const [Email, setEmail] = useState(emailParam || "");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);

  // Set Waktu Berjalan
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Input Otp
  const handleChange = (index, value) => {
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;

    // Fokus ke input berikutnya jika input terisi dan belum mencapai input terakhir
    if (value && index < otpInputs.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Fokus ke input sebelumnya jika nilai dihapus dan bukan input pertama
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }

    setOtpInputs(newOtpInputs);
  };

  // Resend-Otp
  const handleResend = async () => {
    const loadingToastId = showLoadingToast("Loading ...");
    const resendData = await dispatch(
      getResendOtp({
        email: Email,
      }),
    );
    toast.dismiss(loadingToastId);
    if (resendData) {
      showSuccessToast("Resend OTP successfully, Check your email or spam!");
      setSeconds(60);
    }
  };

  // Verify-Otp
  const handleSave = async () => {
    const loadingToastId = showLoadingToast("Loading ...");
    const otpData = await dispatch(
      otpAction({
        email: Email,
        otp: otpInputs.join(""),
      }),
    );
    toast.dismiss(loadingToastId);
    if (otpData) {
      showSuccessToast("Activation successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto w-full rounded-lg md:mt-0 md:max-w-md">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex w-[22rem] flex-col lg:w-[30rem]">
            <div className="absolute top-[100px] cursor-pointer md:top-[320px] lg:top-[120px]"></div>
            <span className="items-center py-4 text-3xl font-bold text-zinc-900">
              Masukkan OTP
            </span>

            {/* Masukkan Kode OTP */}
            <div className="flex flex-col gap-2">
              <span className="py-6 text-center text-lg">
                Ketik 6 digit kode yang dikirim ke{" "}
                <span className="font-bold">{Email}</span>
              </span>

              {/* Lingkaran Otp */}
              <div className="flex items-center justify-center gap-4">
                {otpInputs.map((value, index) => (
                  <div
                    key={index}
                    className="h-[50px] w-[50px] rounded-xl border"
                  >
                    <input
                      id={`otp-input-${index}`}
                      placeholder=""
                      className="h-full w-full rounded-xl text-center font-semibold"
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {seconds > 0 ? (
                <span className="py-6 text-center text-lg">
                  Kirim ulang OTP dalam{" "}
                  <span className="font-bold text-zinc-900">{seconds}</span>{" "}
                  detik
                </span>
              ) : (
                <span
                  className="cursor-pointer py-6 text-center text-xl font-bold text-red-500"
                  onClick={handleResend}
                >
                  Kirim Ulang OTP
                </span>
              )}
            </div>

            {/* Button Simpan */}
            <div className="flex flex-col py-4">
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-zinc-900 py-3 text-lg font-semibold text-white hover:bg-zinc-800"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </motion.div>
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
