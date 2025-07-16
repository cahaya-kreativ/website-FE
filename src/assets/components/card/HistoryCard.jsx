import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Icons
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  ArrowRight,
  Package,
  LocationEdit,
} from "lucide-react";

export const HistoryCard = ({ order }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: "bg-amber-500",
      UNPAID: "bg-gray-500",
      PROCESS: "bg-blue-500",
      DONE: "bg-green-500",
      CANCELLED: "bg-red-500",
    };

    return statusMap[status.toUpperCase()] || "bg-gray-500";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const contentVariants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-700 shadow-lg"
    >
      <div className="flex flex-col gap-4 rounded-lg border border-zinc-600 p-5 shadow-md md:flex-row md:items-center">
        {order.status === "CANCELLED" ? (
          <div className="flex flex-1 flex-col gap-2">
            <h3 className="text-xl font-bold text-red-500">Order Dibatalkan</h3>
            <p className="text-sm text-zinc-300">
              {order.note || "Tidak ada catatan."}
            </p>
          </div>
        ) : (
          <>
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={order.orderDetails[0].product.image}
                alt={order.orderDetails[0].product.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-white transition-colors duration-300 hover:text-amber-400">
                  {order.orderDetails[0].product.name}
                </h3>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {order.orderDetails[0].product.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-amber-400">
                  Rp{" "}
                  <span className="font-mono">
                    {formatNumber(order.total_amount)}
                  </span>
                </p>
                <button
                  className="flex cursor-pointer items-center gap-1 rounded-full bg-zinc-600 px-3 py-1 text-sm text-white transition-colors duration-300 hover:scale-105 hover:bg-zinc-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? (
                    <>
                      <span>Sembunyikan</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Detail</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && order.status !== "CANCELLED" && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
            className="border-t border-zinc-600 bg-zinc-800/50 px-5 py-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg bg-zinc-700/70 p-4 shadow-lg">
                <h4 className="flex items-center gap-2 font-semibold text-white">
                  <Package size={16} />
                  Detail Pesanan
                </h4>
                <div className="space-y-2 text-sm text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span>Kode Order:</span>
                    <span className="font-mono font-semibold text-amber-400">
                      {order.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Durasi:</span>
                    <span>
                      {formatDuration(order.orderDetails[0].product.duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status Pembayaran:</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Pembayaran:</span>
                    <span className="font-semibold text-amber-400">
                      Rp {formatNumber(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {order.schedule && (
                <div className="space-y-3 rounded-lg bg-zinc-700/50 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-white">
                    <MapPin size={16} />
                    Jadwal & Lokasi
                  </h4>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Tanggal:</span>
                      </div>
                      <span>{formatDate(order.schedule.date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>Waktu:</span>
                      </div>
                      <span>{order.schedule.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LocationEdit size={14} />
                        <span>Lokasi:</span>
                      </div>
                      <span className="max-w-[125px] truncate">
                        {order.schedule.location}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-lg bg-zinc-700/70 p-4 shadow-lg">
              <h4 className="flex items-center gap-2 font-semibold text-white">
                <FileText size={16} />
                Catatan
              </h4>
              <p className="mt-2 text-zinc-300 italic">
                {order.note || "Tidak ada catatan."}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate(`/history/${order.id}`)}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:scale-105 hover:bg-amber-600"
              >
                Lihat Detail Lengkap
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add PropTypes validation
HistoryCard.propTypes = {
  order: PropTypes.shape({
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.shape({
          image: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          duration: PropTypes.number.isRequired,
        }).isRequired,
      }),
    ).isRequired,
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total_amount: PropTypes.string.isRequired,
    note: PropTypes.string,
    schedule: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
      location: PropTypes.string,
    }),
  }).isRequired,
};
