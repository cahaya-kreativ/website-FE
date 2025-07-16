import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";

// Components
import { NavbarNotif } from "../../../assets/components/navbar/NavbarNotif";
import { showSuccessToast } from "../../../helper/ToastHelper";

// Icons
import { GoArrowLeft } from "react-icons/go";
import { IoNotificationsCircleSharp } from "react-icons/io5";

// Redux Actions
import { getNotificationsAction } from "../../../redux/action/user/notification/getNotificationsAction";
import { putAllNotificationAction } from "../../../redux/action/user/notification/putAllNotificationAction";
import { putNotificationAction } from "../../../redux/action/user/notification/putNotificationAction";

// Pagination
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const Notification = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeNotif = useSelector((state) => state.notifications.notifications);
  const [pagination, setPagination] = useState({});
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchNotifications = async (page) => {
    setLoading(true);
    const result = await dispatch(getNotificationsAction(page));
    if (result) {
      setPagination(result.pagination);
    }
    scrollToTop()
    setLoading(false);
  };

  useEffect(() => {
    scrollToTop()
    fetchNotifications(active);
  }, [active]);

  const handleMarkAsRead = async () => {
    setLoading(true);
    const success = await dispatch(putAllNotificationAction());
    if (success) {
      await fetchNotifications(active); // Tunggu fetch selesai
      showSuccessToast("All Notifications are successfully marked as read")
    }
    setLoading(false);
  };

  const handleMarkAsReadByID = async (notificationId) => {
    if (notificationId) {
      setLoading(true);
      const success = await dispatch(putNotificationAction(notificationId));
      if (success) {
        await fetchNotifications(active);
      }
      setLoading(false);
    }
  };

  const getItemProps = (index) => ({
    className: `flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
      active === index
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
        : "text-white hover:text-zinc-900 hover:bg-white"
    }`,
    onClick: () => {
      setActive(index);
      fetchNotifications(index);
      scrollToTop();
    },
  });

  const renderPaginationButtons = () => {
    const totalPages = pagination.total_pages || 1;
    const buttons = [];
    let startPage = Math.max(active - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);
    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant="text"
          {...getItemProps(i)}
          disabled={i > totalPages}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  const nextPage = () => {
    if (active < pagination.total_pages) {
      const next = active + 1;
      setActive(next);
      fetchNotifications(next);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (active > 1) {
      const prev = active - 1;
      setActive(prev);
      fetchNotifications(prev);
      scrollToTop();
    }
  };

  return (
    <>
      {<NavbarNotif style={{ zIndex: 1 }} />}
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-6 pt-28 md:px-8 md:py-32 md:pb-0 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {isMobile ? (
              <div className="mb-6 text-right">
                <button
                  className="text-amber-500 transition-all duration-300 hover:scale-105 hover:text-amber-400"
                  onClick={handleMarkAsRead}
                >
                  Mark As Read
                </button>
              </div>
            ) : (
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <GoArrowLeft
                    size={30}
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-white transition-colors duration-300 hover:text-amber-500"
                  />
                  <span className="text-xl font-bold text-white">
                    Kembali Ke Beranda
                  </span>
                </div>
                <button
                  className="cursor-pointer font-medium text-amber-500 transition-all duration-300 hover:scale-105 hover:text-amber-400"
                  onClick={handleMarkAsRead}
                >
                  Mark As Read
                </button>
              </div>
            )}

            <div className="rounded-xl border border-zinc-700 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800">
              <div className="rounded-t-xl border-b border-zinc-700 bg-zinc-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <motion.div
                      className="h-10 w-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  </div>
                ) : storeNotif && storeNotif.length > 0 ? (
                  <div className="space-y-4">
                    {storeNotif.map((notification) => {
                      const createdAt = new Date(notification.createdAt);
                      const date = createdAt.toLocaleDateString(); // Get date
                      const time = createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }); // Get time without AM/PM

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-xl p-4 transition-all duration-300 ${
                            !notification.isRead
                              ? "cursor-pointer border border-amber-500/20 bg-amber-500/10 transition-transform duration-300 hover:scale-105"
                              : "border border-zinc-700 bg-zinc-800"
                          }`}
                          onClick={() => {
                            if (!notification.isRead) {
                              handleMarkAsReadByID(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <IoNotificationsCircleSharp
                              size={24}
                              className="mt-1 text-amber-500"
                            />
                            <div className="flex-1">
                              <div className="mb-2 flex items-center justify-between">
                                <h3 className="font-semibold text-white">
                                  {notification.title}
                                </h3>
                                <div className="text-right text-sm text-gray-400">
                                  <div>{date}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-4 text-gray-300">
                                <p>{notification.message}</p>
                                <div className="text-right text-sm text-gray-400">
                                  {time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    Tidak ada notifikasi saat ini.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="text"
                className="flex cursor-pointer items-center gap-2 text-white transition-transform duration-300 hover:scale-110"
                onClick={prevPage}
                disabled={active === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-2">
                {renderPaginationButtons()}
              </div>
              <Button
                variant="text"
                className="flex cursor-pointer items-center gap-2 text-white transition-transform duration-300 hover:scale-110"
                onClick={nextPage}
                disabled={active === pagination.total_pages}
              >
                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
