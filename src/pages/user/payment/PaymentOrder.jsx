import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getDetailOrderAction } from "../../../redux/action/user/order/getOrderAction";
import { createPaymentAction } from "../../../redux/action/user/payment/PaymentAction";

// Icons
import {
  Calendar,
  CircleUser,
  Clock,
  FileText,
  MapPin,
  Banknote,
} from "lucide-react";

export const PaymentOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openSections, setOpenSections] = useState({
    1: false,
    2: false,
    3: true,
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redux Store
  const authLoading = useSelector((state) => state.authLogin.loading);
  const { orderDetail } = useSelector((state) => state.getOrders);
  const userData = useSelector((state) => state.authLogin.user);

  // Urutkan berdasarkan payment_stage
  const sortedPayments = [...(orderDetail?.payments || [])].sort(
    (a, b) => a.payment_stage - b.payment_stage,
  );

  // Cari pembayaran yang belum lunas dan punya payment_url
  const unpaidWithUrl = sortedPayments.filter(
    (p) => p.status === "unpaid" && p.payment_url,
  );

  // Ambil pembayaran pertama yang sesuai
  const nextUnpaidPayment = unpaidWithUrl.length > 0 ? unpaidWithUrl[0] : null;

  // Cek apakah sudah ada link midtrans
  const hasMidtransLink = nextUnpaidPayment !== null;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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

  // Fungsi saat klik tombol Pay
  const handlePaymentClick = async () => {
    const loadingToastId = showLoadingToast("Loading ...");
    if (!selectedMethod) {
      showErrorToast("Silakan pilih metode pembayaran");
      return;
    }

    try {
      setIsLoading(true);

      // Buat pembayaran baru
      const result = await dispatch(
        createPaymentAction(orderId, { method_payment: selectedMethod }),
      );
      toast.dismiss(loadingToastId);

      if (result) {
        showSuccessToast(
          `Create Payment with Method ${selectedMethod} successfully`,
        );
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      }
    } catch (error) {
      console.error("Error saat membuat pembayaran:", error);
      showErrorToast("Gagal membuat pembayaran. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (orderId) {
      dispatch(getDetailOrderAction(orderId));
    }
  }, [dispatch, orderId]);

  if (authLoading) return <LoadingSpinner />;

  if (!orderDetail) return <LoadingSpinner />;

  return (
    <>
      <motion.div
        className="min-h-screen bg-zinc-900 md:mt-16"
        initial={{ opacity: 0 }} // Opacity awal
        animate={{ opacity: 1 }} // Opacity akhir
        transition={{ duration: 0.5 }} // Durasi transisi
      >
        {/* Navbar */}
        {<NavbarLogin style={{ zIndex: 1 }} />}

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
              <div className="mt-12 mb-4 border-b border-gray-600 pb-2 text-gray-300 md:mt-10 md:flex md:justify-between">
                <button
                  className="group flex cursor-pointer items-center transition-colors hover:text-blue-600"
                  onClick={() => navigate(-1)}
                >
                  <FiChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Return to History Order
                </button>
                <div className="mt-6 flex justify-center gap-2 pb-2 text-sm md:mt-2">
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
                  {" > "}
                  <span
                    className={
                      openSections[3]
                        ? "cursor-pointer font-medium text-blue-500"
                        : "cursor-pointer font-medium text-white"
                    }
                    onClick={() => toggleSection(3)}
                  >
                    Payment Method
                  </span>
                </div>
              </div>

              {/* Customer Information Section */}
              <div className="rounded-lg bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(1)}
                  className="flex w-full cursor-pointer justify-between border-b border-white pb-2 text-left text-white"
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <CircleUser className="text-amber-500" size={20} />
                    User Information
                  </h3>
                  <span>{openSections[1] ? "-" : "+"}</span>
                </button>
                {openSections[1] && (
                  <div className="space-y-2 px-2 pt-2">
                    <p className="text-zinc-300">
                      <span className="font-medium text-white">Name:</span>{" "}
                      {userData?.fullname}
                    </p>
                    <p className="text-zinc-300">
                      <span className="font-medium text-white">Email:</span>{" "}
                      {userData?.email}
                    </p>
                    <p className="text-zinc-300">
                      <span className="font-medium text-white">
                        Phone Number:
                      </span>{" "}
                      {userData?.phoneNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Pick Date Section */}
              <div className="mt-4 rounded-lg border-b border-gray-600 bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(2)}
                  className="flex w-full cursor-pointer justify-between border-b border-white pb-2 text-left text-white"
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Calendar className="text-amber-500" size={20} />
                    Schedule Information
                  </h3>
                  <span>{openSections[2] ? "-" : "+"}</span>
                </button>
                {openSections[2] && (
                  <div className="grid gap-6 py-4 md:grid-cols-2">
                    <motion.div className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                          <Calendar size={20} />
                        </div>
                        <span className="font-medium text-white">Date</span>
                      </div>
                      <p className="text-zinc-300">
                        {orderDetail?.schedule.date ===
                        orderDetail?.schedule.endDate ? (
                          format(
                            new Date(orderDetail?.schedule.endDate),
                            "EEEE, dd MMMM yyyy",
                          )
                        ) : (
                          <>
                            {format(
                              new Date(orderDetail?.schedule.date),
                              "EEEE, dd MMMM yyyy",
                            )}
                            {" - "}
                            {format(
                              new Date(orderDetail?.schedule.endDate),
                              "EEEE, dd MMMM yyyy",
                            )}
                          </>
                        )}
                      </p>
                    </motion.div>

                    <motion.div className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                          <Clock size={20} />
                        </div>
                        <span className="font-medium text-white">Time</span>
                      </div>
                      <p className="text-zinc-300">
                        {orderDetail?.schedule.time ===
                        orderDetail?.schedule.endTime ? (
                          orderDetail?.schedule.endTime + " WIB"
                        ) : (
                          <>
                            {orderDetail?.schedule.time} -{" "}
                            {orderDetail?.schedule.endTime} WIB
                          </>
                        )}
                      </p>
                    </motion.div>

                    <motion.div className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-4 md:col-span-2">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                          <MapPin size={20} />
                        </div>
                        <span className="font-medium text-white">Location</span>
                      </div>
                      <p className="text-zinc-300">
                        {orderDetail?.schedule.location}
                      </p>
                    </motion.div>

                    <motion.div className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-4 md:col-span-2">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                          <FileText size={20} />
                        </div>
                        <span className="font-medium text-white">
                          Additional Note
                        </span>
                      </div>
                      <p className="text-zinc-300">
                        {orderDetail?.note || "No additional notes"}
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="mt-4 rounded-lg border-b border-gray-600 bg-zinc-800 p-6 shadow-md">
                <button
                  onClick={() => toggleSection(3)}
                  className="flex w-full cursor-pointer justify-between border-b border-white pb-2 text-left text-white"
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Banknote className="text-amber-500" size={20} />
                    Payment Method
                  </h3>
                  <span>{openSections[3] ? "-" : "+"}</span>
                </button>

                {openSections[3] && (
                  <div className="mt-4 space-y-4">
                    {/* Jika sudah ada link Midtrans */}
                    {hasMidtransLink ? (
                      <div className="space-y-4">
                        <p className="text-white">
                          Anda sedang membayar:
                          <strong>
                            {" "}
                            {nextUnpaidPayment.method_payment === "fullPayment"
                              ? "Full Payment"
                              : `DP Tahap ${nextUnpaidPayment.payment_stage}`}
                          </strong>
                        </p>
                        <div className="w-full overflow-hidden rounded-lg border border-amber-500 shadow-lg md:w-[70%]">
                          <iframe
                            src={nextUnpaidPayment.payment_url}
                            title="Midtrans Payment"
                            width="100%"
                            height="600px" // Atur tinggi sesuai kebutuhan
                            frameBorder="0"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      </div>
                    ) : (
                      // Belum ada link Midtrans sama sekali → tampilkan form
                      <>
                        <label className="block text-white">
                          Pilih Metode Pembayaran
                        </label>
                        <select
                          value={selectedMethod}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-amber-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="">-- Pilih Metode --</option>
                          <option value="fullPayment">Full Payment</option>
                          <option value="downPayment">Down Payment</option>
                        </select>

                        <button
                          onClick={handlePaymentClick}
                          disabled={isLoading || !selectedMethod}
                          className={`mt-4 w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700 ${
                            isLoading ? "cursor-not-allowed opacity-70" : ""
                          }`}
                        >
                          {isLoading ? "Memproses..." : "Pay"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                  {orderDetail?.orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={detail.product?.image}
                          alt="Product"
                          className="h-12 w-12 rounded-md bg-gray-100"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-white">
                            {detail.product.name}
                          </p>
                          <p className="text-sm text-gray-300">
                            Quantity: {detail.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-white">
                        {formatPrice(detail.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="my-6 border-t border-gray-200"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration</span>
                    <span className="font-medium text-white">
                      {formatDuration(
                        orderDetail.orderDetails?.[0].product?.duration,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price</span>
                    <span className="font-medium text-white">
                      {formatPrice(orderDetail.orderDetails?.[0].price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Discount</span>
                    <span className="font-medium text-blue-500">
                      - {formatPrice(orderDetail.orderDetails?.[0].discount)}
                    </span>
                  </div>
                </div>
                <div className="my-6 border-t border-gray-200"></div>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-white">
                      {formatPrice(orderDetail?.total_amount)}
                    </span>
                  </div>
                </div>
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
