import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Calendar,
  CircleUser,
  Clock,
  MapPin,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock4,
  Truck,
  Receipt,
  CreditCard,
  Phone,
  X,
  Loader2,
  Info,
  CheckCircle,
} from "lucide-react";

// Components
import { NavbarLogin } from "../../../assets/components/navbar/NavbarLogin";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";
import { Footer } from "../../../assets/components/footer/Footer";

// Redux Action
import { getDetailOrderAction } from "../../../redux/action/user/order/getOrderAction";
import { createReviewAction } from "../../../redux/action/user/reviews/createReviewAction";
import { cancelOrderAction } from "../../../redux/action/admin/order/CancelOrderAction";

// Helper
import { showSuccessToast } from "../../../helper/ToastHelper";

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

const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        icon: <Clock4 size={16} className="text-amber-500" />,
      },
      unpaid: {
        color: "bg-gray-500 text-white border-gray-500/20",
        icon: <XCircle size={16} className="text-white" />,
      },
      process: {
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        icon: <Truck size={16} className="text-blue-500" />,
      },
      done: {
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        icon: <CheckCircle2 size={16} className="text-green-500" />,
      },
      cancelled: {
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        icon: <XCircle size={16} className="text-red-500" />,
      },
    };
    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(status);

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
    >
      {statusInfo.icon}
      {status.toUpperCase()}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(["pending", "unpaid", "process", "done", "cancelled"])
    .isRequired,
};

const ProductDetail = ({ detail }) => {
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="h-48 w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-700/50 md:w-48"
      >
        <img
          src={detail.product.image}
          alt={detail.product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </motion.div>
      <div className="flex-1 space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-white">
            {detail.product.name}
          </h4>
          <p className="font-medium text-amber-500">{detail.product.label}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center gap-2 rounded-full bg-zinc-700/50 px-3 py-1.5 text-sm text-zinc-300">
            <Camera size={16} />
            {detail.quantity} Session
          </span>
          <span className="flex items-center gap-2 rounded-full bg-zinc-700/50 px-3 py-1.5 text-sm text-zinc-300">
            <Clock size={16} />
            {formatDuration(detail.product.duration)}
          </span>
        </div>
        <p className="text-base leading-relaxed text-zinc-400">
          {detail.product.description}
        </p>
      </div>
    </div>
  );
};

ProductDetail.propTypes = {
  detail: PropTypes.shape({
    id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const ScheduleInfo = ({ schedule }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-5"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
            <Calendar size={20} />
          </div>
          <span className="font-medium text-white">Date</span>
        </div>
        <p className="text-zinc-300">
          {schedule.date === schedule.endDate ? (
            format(new Date(schedule.endDate), "EEEE, dd MMMM yyyy")
          ) : (
            <>
              {format(new Date(schedule.date), "EEEE, dd MMMM yyyy")}
              {" - "}
              {format(new Date(schedule.endDate), "EEEE, dd MMMM yyyy")}
            </>
          )}
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-5"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
            <Clock size={20} />
          </div>
          <span className="font-medium text-white">Time</span>
        </div>
        <p className="text-zinc-300">
          {schedule.time === schedule.endTime ? (
            schedule.endTime + " WIB"
          ) : (
            <>
              {schedule.time} - {schedule.endTime} WIB
            </>
          )}
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-5 md:col-span-2"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
            <MapPin size={20} />
          </div>
          <span className="font-medium text-white">Location</span>
        </div>
        <p className="text-zinc-300">{schedule.location}</p>
      </motion.div>
    </div>
  );
};

ScheduleInfo.propTypes = {
  schedule: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

const PaymentSummary = ({
  orderDetails,
  totalAmount,
  remainingAmount,
  paymentStatus,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {orderDetails.map((detail) => (
        <div key={detail.id} className="flex items-center justify-between">
          <div className="text-zinc-300">
            <p className="font-medium">{detail.product.name}</p>
            <p className="text-sm text-zinc-400">Quantity: {detail.quantity}</p>
          </div>
          <span className="font-medium text-white">
            {formatPrice(detail.subtotal)}
          </span>
        </div>
      ))}

      {/* Diskon jika ada */}
      {orderDetails[0].discount !== "0" && (
        <div className="flex justify-between border-t border-zinc-700/50 py-2 text-green-500">
          <span>Discount</span>
          <span>-{formatPrice(orderDetails[0].discount)}</span>
        </div>
      )}

      {/* Total Pembayaran */}
      <div className="mt-4 border-t border-zinc-700/50 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-white">Total</span>
          <span className="text-xl font-semibold text-amber-500">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Tampilkan Remaining Amount jika diperlukan */}
      {paymentStatus.showRemainingAmount && (
        <p className="mt-2 text-sm text-zinc-300">
          Remaining Amount:{" "}
          <span className="font-semibold text-red-400">
            {paymentStatus.fullRemaining
              ? formatPrice(Number(totalAmount))
              : formatPrice(remainingAmount)}
          </span>
        </p>
      )}
    </div>
  );
};

PaymentSummary.propTypes = {
  orderDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      quantity: PropTypes.number.isRequired,
      subtotal: PropTypes.string.isRequired,
      discount: PropTypes.string.isRequired,
    }),
  ).isRequired,
  totalAmount: PropTypes.string.isRequired,
  remainingAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  paymentStatus: PropTypes.shape({
    showRemainingAmount: PropTypes.bool.isRequired,
    fullRemaining: PropTypes.bool,
  }).isRequired,
};

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className={`cursor-pointer text-3xl transition-colors ${
            rating >= star
              ? "text-amber-500"
              : "text-zinc-600 hover:text-amber-400"
          }`}
        >
          {rating >= star ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = "",
  isSubmitting = false,
  error = null,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
      setLocalError(null);
    }
  }, [isOpen, initialRating, initialComment]);

  const handleSubmit = () => {
    if (rating === 0) {
      setLocalError("Please select a rating");
      return;
    }

    if (!comment) {
      setLocalError("Comment must be required");
      return;
    }

    setLocalError(null);
    onSubmit({ rating, comment });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add Your Review</h2>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {(error || localError) && (
            <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error || localError}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Rating
              </label>
              <div className="mt-2">
                <StarRating
                  rating={rating}
                  onRatingChange={(newRating) => {
                    setRating(newRating);
                    if (newRating > 0 && (localError || error)) {
                      setLocalError(null);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Your Experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (
                    e.target.value.length >= 10 &&
                    localError?.includes("Comment")
                  ) {
                    setLocalError(null);
                  }
                }}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                rows={5}
                placeholder="Share your experience with this order..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialRating: PropTypes.number,
  initialComment: PropTypes.string,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
};

const Notification = ({ notification, onClose }) => {
  if (!notification.show) return null;

  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  }[notification.type];

  const icon = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
  }[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`fixed right-6 bottom-6 flex items-start gap-3 rounded-lg ${bgColor} p-4 pr-8 text-white shadow-lg`}
    >
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="font-medium">
          {notification.type === "success"
            ? "Success"
            : notification.type === "error"
              ? "Error"
              : "Notification"}
        </p>
        <p className="text-sm">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full p-1 hover:bg-black/10"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "info"]).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const CancelOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Reason is required");
      return;
    }
    onSubmit(reason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Cancel Order</h2>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Reason for Cancelled Order
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                rows={3}
                placeholder="Please provide a reason for cancelled order..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Submitting...
                </span>
              ) : (
                "Submit Cancel"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

CancelOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
};

export const DetailHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const authLoading = useSelector((state) => state.authLogin.loading);
  const { orderDetail } = useSelector((state) => state.getOrders);
  const userData = useSelector((state) => state.authLogin.user);

  const [reviewState, setReviewState] = useState({
    isModalOpen: false,
    rating: 0,
    comment: "",
    isSubmitting: false,
    error: null,
    notification: {
      show: false,
      message: "",
      type: "success",
    },
  });

  const [cancelOrderState, setCancelOrderState] = useState({
    isModalOpen: false,
    isSubmitting: false,
    error: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(getDetailOrderAction(id));
    }
  }, [dispatch, id]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  const {
    code,
    status,
    orderDetails,
    schedule,
    note,
    total_amount,
    expired_paid,
    remaining_amount,
  } = orderDetail || {};

  if (!orderDetail) {
    return <LoadingSpinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentStatusInfo = () => {
    const payments = [...(orderDetail?.payments || [])].sort(
      (a, b) => a.payment_stage - b.payment_stage,
    );
    const {
      status: orderStatus,
      is_paid,
      remaining_amount,
    } = orderDetail || {};

    // Jika pesanan dibatalkan
    if (orderStatus === "cancelled") {
      return {
        status: "cancelled",
        label: "Pesanan Dibatalkan",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        icon: <XCircle size={16} className="text-red-500" />,
        message:
          "Pembayaran tidak dapat dilanjutkan karena pesanan dibatalkan.",
        showRemainingAmount: false,
      };
    }

    // Jika semua lunas
    if (is_paid) {
      return {
        status: "paid",
        label: "Lunas Penuh",
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        icon: <CheckCircle2 size={16} className="text-green-500" />,
        message: "Terima kasih! Pembayaran telah lunas.",
        showRemainingAmount: false,
      };
    }

    const paidPayments = payments.filter((p) => p.status === "paid");
    const unpaidPayments = payments.filter((p) => p.status === "unpaid");
    const processPayments = payments.filter((p) => p.status === "process");

    // Sedang diproses
    if (processPayments.length > 0) {
      return {
        status: "process",
        label: "Menunggu Validasi Admin",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        icon: <Clock size={16} className="text-blue-500" />,
        message:
          "Pembayaran sedang menunggu konfirmasi dari admin. Harap tunggu.",
        showRemainingAmount: false,
      };
    }

    // Jika ada yang sudah dibayar dan ada yang belum
    if (paidPayments.length > 0 && unpaidPayments.length > 0) {
      const firstUnpaid = unpaidPayments[0];

      if (firstUnpaid.method_payment === "downPayment") {
        return {
          status: "partial_paid_dp",
          label: "Menunggu Pelunasan",
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: <AlertCircle size={16} className="text-amber-500" />,
          message: `Anda telah membayar DP. Sisa pembayaran: ${formatPrice(
            remaining_amount,
          )}. Harap selesaikan pelunasan sebelum acara.`,
          showRemainingAmount: true,
        };
      } else if (firstUnpaid.method_payment === "fullPayment") {
        return {
          status: "partial_paid_full",
          label: "Menunggu Konfirmasi",
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: <Clock size={16} className="text-blue-500" />,
          message: `Anda telah melakukan pembayaran penuh. Tunggu konfirmasi dari admin.`,
          showRemainingAmount: false,
        };
      }
    }

    // Jika semua belum dibayar
    if (payments.length > 0 && unpaidPayments.length === payments.length) {
      const firstPayment = payments[0];

      if (firstPayment.method_payment === "downPayment") {
        return {
          status: "unpaid_dp",
          label: "Belum Bayar DP",
          color: "bg-red-500/10 text-red-500 border-red-500/20",
          icon: <XCircle size={16} className="text-red-500" />,
          message: `Silakan selesaikan pembayaran DP sebesar: ${formatPrice(
            Number(firstPayment.amount),
          )} sebelum ${format(new Date(expired_paid), "dd MMM yyyy HH:mm")} WIB.`,
          showRemainingAmount: true,
          fullRemaining: true,
        };
      } else if (firstPayment.method_payment === "fullPayment") {
        return {
          status: "unpaid_full",
          label: "Belum Bayar Lunas",
          color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          icon: <CreditCard size={16} className="text-yellow-500" />,
          message: `Silakan selesaikan pembayaran penuh sebesar: ${formatPrice(
            Number(firstPayment.amount),
          )} sebelum ${format(
            new Date(expired_paid),
            "dd MMM yyyy HH:mm",
          )} WIB.`,
          showRemainingAmount: true,
          fullRemaining: true,
        };
      }
    }

    // Default case untuk pending / lainnya
    if (orderStatus === "pending") {
      return {
        status: "pending",
        label: "Menunggu Validasi Admin",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        icon: <Clock size={16} className="text-blue-500" />,
        message:
          "Pesanan sedang menunggu validasi dari admin. Mohon tunggu konfirmasi.",
        showRemainingAmount: false,
      };
    }

    return {
      status: "unpaid",
      label: "Belum Bayar",
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: <XCircle size={16} className="text-red-500" />,
      message: `Silakan selesaikan pembayaran sebelum ${format(
        new Date(expired_paid),
        "dd MMM yyyy HH:mm",
      )} WIB.`,
      showRemainingAmount: false,
    };
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    setReviewState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      await dispatch(createReviewAction(id, { rating, comment }));
      await dispatch(getDetailOrderAction(id));

      setReviewState((prev) => ({
        ...prev,
        isModalOpen: false,
        isSubmitting: false,
        rating: 0,
        comment: "",
      }));

      showSuccessToast("Review submitted successfully!"); // Menampilkan toast sukses
    } catch (error) {
      setReviewState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
      }));
    }
  }; 

  const isReviewed = orderDetail.hasReviewed === true;

  const openReviewModal = () => {
    setReviewState((prev) => ({
      ...prev,
      isModalOpen: true,
      rating: 0,
      comment: "",
      error: null,
    }));
  };

  const closeReviewModal = () => {
    setReviewState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  };

  const handleCancelOrderSubmit = async (reason) => {
    setCancelOrderState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      await dispatch(cancelOrderAction(id, { reason }));
      await dispatch(getDetailOrderAction(id));

      setCancelOrderState((prev) => ({
        ...prev,
        isModalOpen: false,
        isSubmitting: false,
      }));

      showSuccessToast("Order cancelled successfully!"); // Menampilkan toast sukses
    } catch (error) {
      setCancelOrderState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
      }));
    }
  };

  const openCancelOrderModal = () => {
    setCancelOrderState((prev) => ({
      ...prev,
      isModalOpen: true,
      error: null,
    }));
  };

  const closeCancelOrderModal = () => {
    setCancelOrderState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  };

  return (
    <>
      <NavbarLogin style={{ zIndex: 1 }} />
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          {/* Header with enhanced styling */}
          <div className="mt-16 mb-4 flex items-center justify-between rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="flex cursor-pointer items-center justify-center rounded-full bg-zinc-700 p-2.5 text-white transition-colors hover:bg-amber-500 hover:text-white"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Detail Pesanan
                </h1>
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-white">Order Code:</p>
                  <p className="mt-1 text-sm text-amber-500">{code}</p>
                </div>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Order Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Package Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm"
              >
                <div className="border-b border-zinc-700/50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Camera className="text-amber-500" size={20} />
                    Package Details
                  </h3>
                </div>
                <div className="p-6">
                  {orderDetails.map((detail) => (
                    <ProductDetail key={detail.id} detail={detail} />
                  ))}
                </div>
              </motion.div>

              {/* User Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm"
              >
                <div className="border-b border-zinc-700/50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <CircleUser className="text-amber-500" size={20} />
                    User Information
                  </h3>
                </div>
                <div className="space-y-2 p-6">
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">Name:</span>{" "}
                    {userData?.fullname}
                  </p>
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">Email:</span>{" "}
                    {userData?.email}
                  </p>
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">Phone:</span>{" "}
                    {userData?.phoneNumber}
                  </p>
                </div>
              </motion.div>

              {/* Schedule Information Card */}
              {schedule && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm"
                >
                  <div className="border-b border-zinc-700/50 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                      <Calendar className="text-amber-500" size={20} />
                      Schedule Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <ScheduleInfo schedule={schedule} />
                  </div>
                </motion.div>
              )}

              {/* Additional Notes Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm"
              >
                <div className="border-b border-zinc-700/50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <FileText className="text-amber-500" size={20} />
                    Additional Notes
                  </h3>
                </div>
                <div className="p-6">
                  <div className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-5">
                    <p className="text-zinc-300">
                      {note || "No additional notes"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Payment Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Payment Summary Card */}
              <div className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm">
                <div className="border-b border-zinc-700/50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Receipt className="text-amber-500" size={20} />
                    Payment Summary
                  </h3>
                </div>
                <div className="p-6">
                  <PaymentSummary
                    orderDetails={orderDetails}
                    totalAmount={total_amount}
                    remainingAmount={Number(remaining_amount)}
                    paymentStatus={getPaymentStatusInfo()}
                  />
                </div>
              </div>

              {/* Payment Status Card */}
              <div className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/50 shadow-xl backdrop-blur-sm">
                <div className="border-b border-zinc-700/50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <CreditCard className="text-amber-500" size={20} />
                    Payment Status
                  </h3>
                </div>
                <div className="p-6">
                  {(() => {
                    const paymentStatus = getPaymentStatusInfo();
                    return (
                      <div
                        className={`rounded-xl border ${paymentStatus.color} p-5`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {paymentStatus.icon}
                          <span className="font-medium text-white">
                            {paymentStatus.label}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">
                          {paymentStatus.message}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {["paid", "cancelled", "process", "pending"].includes(
                  getPaymentStatusInfo().status,
                ) ? null : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/payment/${id}`)}
                    className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 font-medium text-white transition-all hover:from-amber-600 hover:to-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  >
                    Complete Payment
                  </motion.button>
                )}
                {status === "done" && (
                  <motion.button
                    whileHover={!isReviewed ? { scale: 1.02 } : {}}
                    whileTap={!isReviewed ? { scale: 0.98 } : {}}
                    onClick={!isReviewed ? openReviewModal : undefined}
                    className={`w-full rounded-xl px-6 py-4 font-medium text-white transition-all ${
                      isReviewed
                        ? "bg-gray-500"
                        : "cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    }`}
                    disabled={isReviewed}
                  >
                    {isReviewed ? "Review Sudah Dilakukan" : "Write a Review"}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-4 font-medium text-white transition-all hover:bg-zinc-900/50 focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  onClick={() => navigate("/chat")}
                >
                  <Phone size={18} />
                  Hubungi Kami
                </motion.button>
                {/* Tombol Cancel Order hanya muncul jika status adalah 'pending' atau 'unpaid' */}
                {["pending", "unpaid"].includes(status) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openCancelOrderModal}
                    className="w-full cursor-pointer rounded-xl bg-red-600 px-6 py-4 font-medium text-white transition-all hover:bg-red-700"
                  >
                    Cancel Order
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewState.isModalOpen}
        onClose={closeReviewModal}
        onSubmit={handleReviewSubmit}
        initialRating={reviewState.rating}
        initialComment={reviewState.comment}
        isSubmitting={reviewState.isSubmitting}
        error={reviewState.error}
      />

      {/* Notification */}
      <Notification
        notification={reviewState.notification}
        onClose={() =>
          setReviewState((prev) => ({
            ...prev,
            notification: {
              ...prev.notification,
              show: false,
            },
          }))
        }
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelOrderState.isModalOpen}
        onClose={closeCancelOrderModal}
        onSubmit={handleCancelOrderSubmit}
        isSubmitting={cancelOrderState.isSubmitting}
        error={cancelOrderState.error}
      />
    </>
  );
};

export default DetailHistory;
