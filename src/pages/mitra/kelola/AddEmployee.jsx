import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Component
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Redux
import { addEmployeeAction } from "../../../redux/action/admin/auth/addEmployeeAction";

export const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    if (id === "nama") {
      setFullName(value);
    } else if (id === "email") {
      setEmail(value);
    } else if (id === "telepon") {
      const numericValue = value.replace(/\D/g, "");
      setPhoneNumber(numericValue);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleAddEmployee = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    const employee = await dispatch(
      addEmployeeAction({
        fullname: FullName,
        email: Email,
        phoneNumber: PhoneNumber,
        password: Password,
      }),
    );

    toast.dismiss(loadingToastId);

    if (employee) {
      showSuccessToast("Create employee successfully!");
      setTimeout(() => {
        navigate("/admin/setting?tab=list-employee");
      }, 1000);
    }
  };

  const validateForm = () => {
    if (FullName.length === 0) {
      return showErrorToast("Fullname must be required");
    }

    if (Email.length === 0) {
      return showErrorToast("Email must be required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return showErrorToast("Invalid email format");
    }

    if (PhoneNumber.length === 0) {
      return showErrorToast("Phone Number must be required");
    }

    if (PhoneNumber.length < 10 || PhoneNumber.length > 15) {
      return showErrorToast("Phone number must be between 10 and 15 digits");
    }

    if (Password.length < 8 || Password.length > 50) {
      return showErrorToast("Password must be minimum 8 characters long");
    }

    // variable to count upper case characters in the password.
    let countUpperCase = 0;
    // variable to count lowercase characters in the password.
    let countLowerCase = 0;
    // variable to count digit characters in the password.
    let countDigit = 0;
    // variable to count special characters in the password.
    let countSpecialCharacters = 0;

    for (let i = 0; i < Password.length; i++) {
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

      if (specialChars.includes(Password[i])) {
        // this means that the character is special, so increment countSpecialCharacters
        countSpecialCharacters++;
      } else if (!isNaN(Password[i] * 1)) {
        // this means that the character is a digit, so increment countDigit
        countDigit++;
      } else {
        if (Password[i] === Password[i].toUpperCase()) {
          // this means that the character is an upper case character, so increment countUpperCase
          countUpperCase++;
        }
        if (Password[i] === Password[i].toLowerCase()) {
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

    handleAddEmployee();
  };
  return (
    <div className="text-white">
      <h2 className="mb-4 py-1 text-center text-lg font-semibold">
        Tambah Karyawan
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-left text-lg">Nama</span>
          <input
            placeholder="Nama Lengkap"
            onChange={handleInput}
            className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-white focus:outline-none"
            type="text"
            value={FullName}
            id="nama"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <span className="text-left text-lg">Email</span>
          <input
            placeholder="JohnDoe@gmail.com"
            onChange={handleInput}
            className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-white focus:outline-none"
            type="email"
            value={Email}
            id="email"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="flex flex-col gap-2">
          <span className="text-left text-lg">Nomor Telepon</span>
          <input
            placeholder="08"
            onChange={handleInput}
            className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-white focus:outline-none"
            type="tel"
            value={PhoneNumber}
            id="telepon"
          />
        </div>

        {/* Buat Password */}
        <div className="flex flex-col gap-2">
          <span className="text-left text-lg">Buat Password</span>
          <div className="relative flex flex-col">
            <input
              placeholder="Masukkan Password"
              onChange={handleInput}
              className="rounded-xl border-2 border-slate-300 px-4 py-3 focus:border-white focus:outline-none"
              type={showPassword ? "text" : "password"}
              value={Password}
              id="password"
            />
            {showPassword ? (
              <FiEye
                size={27}
                className="absolute inset-y-3 right-4 w-8 cursor-pointer text-white"
                onClick={handleShowPassword}
              />
            ) : (
              <FiEyeOff
                size={27}
                className="absolute inset-y-3 right-4 w-8 cursor-pointer text-white"
                onClick={handleShowPassword}
              />
            )}
          </div>
        </div>

        {/* Button Daftar */}
        <div className="flex flex-col py-2">
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-blue-500 py-3 text-lg font-semibold text-white hover:bg-blue-600"
            onClick={() => {
              validateForm();
            }}
          >
            Buat Akun
          </button>
        </div>
      </div>
    </div>
  );
};
