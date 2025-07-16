import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { changePassword } from "../../../redux/action/admin/auth/changePasswordAction";

export const ChangedPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adminToken = queryParams.get("token");
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
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputPassword = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "newPasswordConfirmation" ? "confirmPassword" : id]: value,
    }));
  };

  const handleSave = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const success = await dispatch(
      changePassword(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          newPasswordConfirmation: formData.confirmPassword,
        },
        adminToken,
      ),
    );

    toast.dismiss(loadingToastId);

    if (success) {
      showSuccessToast("Your password has been successfully updated!");
      setTimeout(() => {
        navigate("/admin/setting?tab=list-employee");
      }, 1000);
    }
  };

  const validateFormPassword = () => {
    const { newPassword } = formData;

    if (newPassword.length < 8 || newPassword.length > 50) {
      return showErrorToast(
        "Password must be between 8 and 50 characters long",
      );
    }

    let counts = {
      upper: 0,
      lower: 0,
      digit: 0,
      special: 0,
    };

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

    if (counts.lower === 0)
      return showErrorToast("Password must contain at least 1 lowercase");
    if (counts.upper === 0)
      return showErrorToast("Password must contain at least 1 uppercase");
    if (counts.digit === 0)
      return showErrorToast("Password must contain at least 1 digit number");
    if (counts.special === 0)
      return showErrorToast("Password must contain at least 1 symbol");

    handleSave();
  };
  return (
    <div className="text-white">
      <h2 className="mb-4 py-1 text-center text-lg font-semibold">
        Ganti Kata Sandi
      </h2>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {[
            {
              id: "oldPassword",
              label: "Password Lama",
              show: "old",
              placeholder: "Masukkan Password Lama",
            },
            {
              id: "newPassword",
              label: "Password Baru",
              show: "new",
              placeholder: "Masukkan Password Baru",
            },
            {
              id: "newPasswordConfirmation",
              label: "Konfirmasi Password Baru",
              show: "confirm",
              placeholder: "Ulangi Password Baru",
            },
          ].map((field, index) => (
            <div key={field.id} className="space-y-2">
              <label className="text-lg text-white">{field.label}</label>
              <div className="relative pt-2">
                <input
                  type={showPasswords[field.show] ? "text" : "password"}
                  id={field.id}
                  value={
                    formData[
                      field.id === "newPasswordConfirmation"
                        ? "confirmPassword"
                        : field.id
                    ]
                  }
                  placeholder={field.placeholder}
                  onChange={handleInputPassword}
                  className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.show)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 transition-colors duration-300 hover:text-white"
                >
                  {showPasswords[field.show] ? (
                    <FiEye size={20} className="cursor-pointer text-white" />
                  ) : (
                    <FiEyeOff size={20} className="cursor-pointer text-white" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={validateFormPassword}
            className="w-full cursor-pointer rounded-xl bg-blue-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
};
