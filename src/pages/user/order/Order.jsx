import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";

// Icons
import { FiChevronLeft } from "react-icons/fi";

// Components
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Helper
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Redux Actions
import { getGoogleLoginAction } from "../../../redux/action/user/auth/getGoogleLoginAction";
import { getDetailProductAction } from "../../../redux/action/admin/products/getProductsAction";
import {
  createOrderAction,
  discountAction,
} from "../../../redux/action/user/order/createOrderAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

export const Order = () => {
  const { productId } = useParams(); // Mengambil productId dari URL
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    // 3: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux Store
  const authLoading = useSelector((state) => state.authLogin.loading);
  const userData = useSelector((state) => state.authLogin.user);
  const product = useSelector((state) => state.getProducts.productDetail);

  // State
  const [newFullName, setNewFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [code, setCode] = useState(""); // Untuk input code discount
  const [discountCode, setDiscountCode] = useState(""); // Untuk menyimpan discount code yang valid
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Get Token from URL (Google)
  const token = CookieStorage.get(CookiesKeys.AuthToken);
  const urlParams = new URLSearchParams(location.search);
  const authTokenValue = urlParams.get("token");

  useEffect(() => {
    if (authTokenValue) {
      dispatch(getGoogleLoginAction(authTokenValue));
    }
  }, [authTokenValue, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (productId) {
        await dispatch(getDetailProductAction(productId));
      }
    };
    fetchData();
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      // Parse harga product ke number
      const price = parseInt(product.price.toString().replace(/\./g, ""), 10);
      const newSubtotal = price * quantity;
      setSubtotal(newSubtotal);
      setTotal(newSubtotal - discountAmount);
    }
  }, [product, quantity, discountAmount]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInput = (e) => {
    const { id, value } = e.target; // Menggunakan destructuring untuk mendapatkan id dan value
    if (id === "fullname") {
      setNewFullName(value);
    } else if (id === "email") {
      setEmail(value);
    } else if (id === "telepon") {
      // Validasi untuk memastikan hanya angka yang diterima
      const numericValue = value.replace(/\D/g, ""); // Menghapus semua karakter non-digit
      setNewPhoneNumber(numericValue);
    } else if (id === "note") {
      setNote(value);
    } else if (id === "date") {
      setDate(value); // Memperbarui state untuk date
    } else if (id === "time") {
      setTime(value); // Memperbarui state untuk time
    } else if (id === "location") {
      setAddress(value); // Memperbarui state untuk address
    } else if (id === "quantity") {
      setQuantity(value); // Memperbarui state untuk quantity
    } else if (id === "discount") {
      setCode(value);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDuration = (duration) => {
    if (duration >= 720) {
      const months = Math.floor(duration / 720);
      return `${months} bulan`;
    } else if (duration >= 24) {
      const days = Math.floor(duration / 24);
      return `${days} hari`;
    } else {
      return `${duration} jam`;
    }
  };

  const handleApplyDiscount = async () => {
    // Jika discount code kosong, reset discount
    if (!code) {
      setDiscountAmount(0);
      setDiscountCode(""); // Reset discountCode juga
      setTotal(subtotal);
      return;
    }

    const loadingToastId = showLoadingToast("Applying discount...");

    try {
      // Parse subtotal ke number (hilangkan titik jika ada)
      const subtotalNumber = parseInt(
        subtotal.toString().replace(/\./g, ""),
        10,
      );

      const result = await dispatch(discountAction(code, subtotalNumber));

      toast.dismiss(loadingToastId);

      if (result && result.discountAmount) {
        // Simpan discountAmount sebagai number (tanpa format)
        const discountValue = result.discountAmount;
        setDiscountAmount(discountValue);
        setDiscountCode(code);

        // Hitung total baru
        const newTotal = subtotalNumber - discountValue;
        setTotal(newTotal);

        showSuccessToast("Discount applied successfully!");
      } else {
        setDiscountAmount(0);
        setDiscountCode(""); // Reset discountCode jika tidak valid
        setTotal(subtotalNumber);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      setDiscountAmount(0);
      setDiscountCode(""); // Reset discountCode jika error
      setTotal(subtotal);
      showErrorToast("Failed to apply discount");
    }
  };

  const handleOrder = async () => {
    const loadingToastId = showLoadingToast("Loading...");

    // Apply discount if a valid code is provided
    let finalDiscountAmount = discountAmount;
    let finalDiscountCode = discountCode;

    if (code) {
      const subtotalNumber = parseInt(
        subtotal.toString().replace(/\./g, ""),
        10,
      );
      const result = await dispatch(discountAction(code, subtotalNumber));

      if (result && result.discountAmount) {
        finalDiscountAmount = result.discountAmount;
        finalDiscountCode = code;
        showSuccessToast("Discount applied successfully!");
      } else {
        finalDiscountAmount = 0; // Reset if invalid
        finalDiscountCode = ""; // Reset if invalid
      }
    }

    // Mengirimkan data dengan format yang benar
    const orderData = {
      email: userData?.email,
      fullname: newFullName || userData?.fullname,
      phoneNumber: newPhoneNumber || userData?.phoneNumber,
      date: format(new Date(date), "yyyy-MM-dd"), // Format date
      time: time.replace(":", "."), // Mengubah format time menjadi HH.mm
      location: address,
      quantity: quantity,
      note: note,
      code: code,
      discountCode: finalDiscountCode, // Menggunakan discountCode yang sudah divalidasi
    };

    const order = await dispatch(
      createOrderAction(productId, orderData), // Menggunakan orderData yang sudah diformat
    );

    toast.dismiss(loadingToastId);

    if (order) {
      showSuccessToast("Order created successfully and awaiting approval!");
      setTimeout(() => {
        navigate("/history");
      }, 2000);
    }
  };

  const validateForm = () => {
    // Validasi fullname
    if (newFullName.length === 0 && !(userData && userData.fullname)) {
      return showErrorToast("Fullname must be provided");
    }

    // Validasi no telp
    if (newPhoneNumber.length === 0 && !(userData && userData.phoneNumber)) {
      return showErrorToast("Phone number must be provided");
    }

    // Validasi email
    if (!(userData && userData.email)) {
      return showErrorToast("Email must be provided");
    }

    // Validasi tanggal
    if (date.length === 0) {
      return showErrorToast("Date must be selected");
    }

    // Validasi waktu hanya untuk kategori 1
    if (product?.categoryId === 1 && time.length === 0) {
      return showErrorToast("Time must be selected");
    }

    // Validasi lokasi
    if (address.length === 0) {
      return showErrorToast("Location must be provided");
    }

    handleOrder(); // Memanggil handleOrder setelah semua validasi berhasil
  };

  const isFormValid = () => {
    return (
      userData?.email && // Ensure userData is not null and email exists
      (newFullName.length > 0 || userData?.fullname) && // Ensure fullname is filled or taken from userData
      (newPhoneNumber.length > 0 || userData?.phoneNumber) && // Ensure phone number is filled or taken from userData
      date.length > 0 &&
      time.length > 0 &&
      address.length > 0 &&
      quantity > 0
    );
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
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1); /* Putih */
          cursor: pointer;
        }
        input[type="time"]:hover {
          background-color: #3f3f46; /* Tailwind zinc-700 */
        }
      `}</style>

      <motion.div
        className="min-h-screen bg-zinc-900 md:mt-16"
        initial={{ opacity: 0 }} // Opacity awal
        animate={{ opacity: 1 }} // Opacity akhir
        transition={{ duration: 0.5 }} // Durasi transisi
      >
        {/* Navbar */}
        <NavbarLogin style={{ zIndex: 1 }} />

        {/* Main Content */}
        <div className="mx-auto max-w-7xl bg-zinc-900 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ y: -20 }} // Memulai dari posisi Y -20
              animate={{ y: 0 }} // Bergerak ke posisi Y 0
              transition={{ duration: 0.3 }} // Durasi transisi
            >
              {/* Breadcrumb */}
              <div className="mt-10 mb-4 flex justify-between border-b border-gray-600 pb-2 text-gray-300">
                <button
                  className="group flex cursor-pointer items-center transition-colors hover:text-blue-600"
                  onClick={() => navigate(-1)}
                >
                  <FiChevronLeft className="mr-2 hidden h-4 w-4 transition-transform group-hover:-translate-x-1 md:block" />
                  Return to Product
                </button>
                <div className="mt-2 flex gap-2 pb-2 text-sm">
                  <span className="text-blue-500">Order</span> {" > "}
                  <span
                    className={
                      openSections[1]
                        ? "hidden cursor-pointer font-medium text-blue-500 md:block"
                        : "hidden cursor-pointer font-medium text-white md:block"
                    }
                    onClick={() => toggleSection(1)}
                  >
                    Customer Information
                  </span>{" "}
                  <span
                    className={
                      openSections[1]
                        ? "block cursor-pointer font-medium text-blue-500 md:hidden"
                        : "block cursor-pointer font-medium text-white md:hidden"
                    }
                    onClick={() => toggleSection(1)}
                  >
                    Biodata
                  </span>{" "}
                  {" > "}
                  <span
                    className={
                      openSections[2]
                        ? "cursor-pointer font-medium text-blue-500"
                        : "cursor-pointer font-medium text-white"
                    }
                    onClick={() => toggleSection(2)}
                  >
                    Pick Date
                  </span>{" "}
                  {/* {" > "}
                  <span
                    className={
                      openSections[3]
                        ? "cursor-pointer font-medium text-blue-500"
                        : "cursor-pointer font-medium text-white"
                    }
                    onClick={() => toggleSection(3)}
                  >
                    Payment Method
                  </span> */}
                </div>
              </div>

              {/* Customer Information Section */}
              <div className="rounded-lg bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(1)}
                  className="flex w-full cursor-pointer justify-between border-b border-white text-left text-white"
                >
                  <h2 className="mb-2 text-lg font-medium">
                    Customer Information
                  </h2>
                  <span>{openSections[1] ? "-" : "+"}</span>
                </button>
                {openSections[1] && (
                  <div>
                    <div className="mb-8">
                      <h3 className="mt-2 mb-4 text-lg font-medium text-white">
                        Email
                      </h3>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-700 px-4 py-3 text-white transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          placeholder="Enter your email address"
                          value={userData?.email}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-medium text-white">
                        Biodata
                      </h3>
                      <input
                        type="text"
                        id="fullname"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-white transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        placeholder="Fullname"
                        value={newFullName || userData?.fullname || ""}
                        onChange={handleInput}
                      />
                      <input
                        type="tel"
                        required
                        id="telepon"
                        className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-white transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        placeholder="Phone Number"
                        value={newPhoneNumber || userData?.phoneNumber || ""}
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pick Date Section */}
              <div className="mt-4 rounded-lg border-b border-gray-600 bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(2)}
                  className="flex w-full cursor-pointer justify-between border-b border-white text-left text-white"
                >
                  <h2 className="mb-2 text-lg font-medium">
                    Pick a Delivery Date
                  </h2>
                  <span>{openSections[2] ? "-" : "+"}</span>
                </button>
                {openSections[2] && (
                  <form className="py-4">
                    <div className="flex gap-4">
                      <input
                        id="date"
                        type="date" // Menggunakan input type date
                        className="rounded-md border border-white p-2 text-xl text-white"
                        min={new Date().toISOString().split("T")[0]} // Mengatur minimum ke tanggal hari ini
                        value={date}
                        required
                        onChange={handleInput} // Menangkap state date
                      />
                      <input
                        id="time"
                        type="time" // Menggunakan input type time
                        className="rounded-md border border-white p-2 text-xl text-white"
                        required
                        value={time}
                        onChange={handleInput} // Menangkap state time
                        min="08.00" // Batasi jam mulai dari 8 pagi
                        max="17.00" // Batasi jam sampai 5 sore
                      />
                    </div>
                    <input
                      type="text"
                      id="location"
                      className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-white transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Location"
                      required
                      value={address}
                      onChange={handleInput}
                    />
                    <textarea
                      id="note"
                      className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-white transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Note Order (Optional)"
                      rows="4"
                      value={note}
                      onChange={handleInput}
                    />
                  </form>
                )}
              </div>

              {/* Payment Method Section */}
              {/* <div className="mt-4 rounded-lg border-b border-gray-600 bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(3)}
                  className="flex w-full cursor-pointer justify-between border-b border-white text-left text-white"
                >
                  <h2 className="mb-2 text-lg font-medium">Payment Method</h2>
                  <span>{openSections[3] ? "-" : "+"}</span>
                </button>
                {openSections[3] && (
                  <div className="flex flex-col">
                    <label className="mt-4 text-white">Select method</label>
                    <select className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none">
                      <option value="gopay">GoPay/GoPay Later</option>
                      <option value="bank_transfer">ATM/Bank Transfer</option>
                      <option value="shopeepay">ShopeePay/SpayLater</option>
                      <option value="other_qris">Other QRIS</option>
                    </select>
                  </div>
                )}
              </div> */}
            </motion.div>

            {/* Right Section - Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ y: -20 }} // Memulai dari posisi Y -20
              animate={{ y: 0 }} // Bergerak ke posisi Y 0
              transition={{ duration: 0.3 }} // Durasi transisi
            >
              <div className="rounded-lg border-b border-gray-600 bg-zinc-800 p-6 shadow-md">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={product?.image}
                        alt="Product"
                        className="h-12 w-12 rounded-md bg-gray-100"
                      />
                      <div className="ml-4">
                        <p className="font-medium text-white">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-300">
                          Quantity: {quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-6 border-t border-gray-200"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price</span>
                    <span className="font-medium text-white">
                      Rp {formatNumber(product?.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax</span>
                    <span className="font-medium text-white">
                      Rp {formatNumber(product?.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration</span>
                    <span className="font-medium text-white">
                      {formatDuration(product?.duration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Discount</span>
                    <span className="font-medium text-white">
                     - Rp {formatNumber(discountAmount)}
                    </span>
                  </div>
                </div>
                <div className="my-6 border-t border-gray-200"></div>
                <div className="mb-6">
                  <div className="flex">
                    <input
                      id="discount"
                      type="text"
                      value={code}
                      onChange={handleInput}
                      className="flex-1 rounded-l-lg border border-gray-300 px-4 py-3 text-white placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Discount code (Optional)"
                    />
                    <button
                      className="cursor-pointer rounded-r-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                      onClick={handleApplyDiscount}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-white">
                      Rp {formatNumber(total)}
                    </span>
                  </div>
                </div>
                <button
                  className={`w-full rounded-lg py-3 font-medium text-white transition-colors ${isFormValid() ? "cursor-pointer bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-600"}`}
                  disabled={!isFormValid()}
                  onClick={validateForm} // Memanggil validateForm saat tombol diklik
                >
                  Order
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </motion.div>
    </>
  );
};
