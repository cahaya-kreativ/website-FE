import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Redux Actions
import { getResetPass } from "../../../redux/action/user/auth/getPasswordAction";

// Helper
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

export const ResetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const dispatch = useDispatch();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setpasswordConfirmation] = useState("");

  const handleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const handleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleInput = (e) => {
    if (e) {
      if (e.target.id === "newPassword") {
        setPassword(e.target.value);
      }
      if (e.target.id === "confirmPassword") {
        setpasswordConfirmation(e.target.value);
      }
    }
  };

  const handleSave = async () => {
    if (password !== passwordConfirmation) {
      showErrorToast("Password and password confirmation do not match!");
      return;
    }
    const loadingToastId = showLoadingToast("Loading...");

    const updatepass = await dispatch(
      getResetPass(
        {
          password: password,
          passwordConfirmation: passwordConfirmation,
        },
        token,
      ),
    );

    toast.dismiss(loadingToastId);

    showSuccessToast("Your password has been changed successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const validateForm = () => {
    if (password.length < 8 || password.length > 12) {
      return showErrorToast(
        "Password must be be between 8 and 12 characters long",
      );
    }

    // variable to count upper case characters in the password.
    let countUpperCase = 0;
    // variable to count lowercase characters in the password.
    let countLowerCase = 0;
    // variable to count digit characters in the password.
    let countDigit = 0;
    // variable to count special characters in the password.
    let countSpecialCharacters = 0;

    for (let i = 0; i < password.length; i++) {
      const specialChars = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "-",
        "+",
        "=",
        "[",
        "{",
        "]",
        "}",
        ":",
        ";",
        "<",
        ">",
        ".",
      ];

      if (specialChars.includes(password[i])) {
        // this means that the character is special, so increment countSpecialCharacters
        countSpecialCharacters++;
      } else if (!isNaN(password[i] * 1)) {
        // this means that the character is a digit, so increment countDigit
        countDigit++;
      } else {
        if (password[i] === password[i].toUpperCase()) {
          // this means that the character is an upper case character, so increment countUpperCase
          countUpperCase++;
        }
        if (password[i] === password[i].toLowerCase()) {
          // this means that the character is lowercase, so increment countUpperCase
          countLowerCase++;
        }
      }
    }

    if (countLowerCase === 0) {
      return showErrorToast("Password must contain at least 1 lowercase");
    }

    if (countUpperCase === 0) {
      return showErrorToast("Password must contain at least 1 uppercase");
    }

    if (countDigit === 0) {
      return showErrorToast("Password must contain at least 1 digit number");
    }

    if (countSpecialCharacters === 0) {
      return showErrorToast("Password must contain at least 1 symbol");
    }

    handleSave();
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
            <span className="items-center py-2 text-4xl font-bold text-zinc-900">
              Reset Password
            </span>

            {/* Password Baru */}
            <div className="flex flex-col gap-2 pt-8">
              <div className="flex justify-between">
                <span className="text-left text-lg">
                  Masukkan Password Baru
                </span>
              </div>
              <div className="relative flex flex-col">
                <input
                  onChange={handleInput}
                  placeholder="Password Baru"
                  className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-zinc-900 focus:outline-none"
                  type={showPassword1 ? "text" : "password"}
                  value={password}
                  id="newPassword"
                />
                {showPassword1 ? (
                  <FiEye
                    size={27}
                    className="absolute inset-y-3 right-4 w-8 cursor-pointer text-slate-400"
                    onClick={handleShowPassword1}
                  />
                ) : (
                  <FiEyeOff
                    size={27}
                    className="absolute inset-y-3 right-4 w-8 cursor-pointer text-slate-400"
                    onClick={handleShowPassword1}
                  />
                )}
              </div>
            </div>

            {/* Konfirmasi Password Baru */}
            <div className="flex flex-col gap-2 pt-8">
              <div className="flex justify-between">
                <span className="text-left text-lg">Ulangi Password Baru</span>
              </div>
              <div className="relative flex flex-col">
                <input
                  onChange={handleInput}
                  placeholder="Ulangi Password Baru"
                  className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-zinc-900 focus:outline-none"
                  type={showPassword2 ? "text" : "password"}
                  value={passwordConfirmation}
                  id="confirmPassword"
                />
                {showPassword2 ? (
                  <FiEye
                    size={27}
                    className="absolute inset-y-3 right-4 w-8 cursor-pointer text-slate-400"
                    onClick={handleShowPassword2}
                  />
                ) : (
                  <FiEyeOff
                    size={27}
                    className="absolute inset-y-3 right-4 w-8 cursor-pointer text-slate-400"
                    onClick={handleShowPassword2}
                  />
                )}
              </div>
            </div>

            {/* Button Simpan */}
            <div className="flex flex-col py-6">
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-zinc-900 py-3 text-lg font-semibold text-white hover:bg-zinc-800"
                onClick={() => {
                  validateForm();
                }}
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
