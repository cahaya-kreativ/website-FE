import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import { NavbarProfile } from "../../../assets/components/navbar/NavbarProfile";
import { SidebarAkun } from "../../../assets/components/sidebar/SidebarAkun";
import { HistoryCard } from "../../../assets/components/card/HistoryCard";
import LoadingSpinner from "../../../assets/components/loading/LoadingSpinner";

// Icons
import { GoArrowLeft } from "react-icons/go";

// Pagination
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Redux Action
import { getOrdersAction } from "../../../redux/action/user/order/getOrderAction";

export const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.getOrders);

  const [pagination, setPagination] = useState({});
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchGetOrders = async (page, filter) => {
    setLoading(true);
    const result = await dispatch(getOrdersAction(page, filter));
    if (result) {
      setPagination(result.pagination);
    }
    scrollToTop();
    setLoading(false);
  };

  useEffect(() => {
    scrollToTop();
    fetchGetOrders(active, filter);
  }, [active, filter]);

  const ordersList = Array.isArray(orders?.formattedOrders)
    ? orders.formattedOrders
    : [];

  const getItemProps = (index) => ({
    className: `flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
      active === index
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
        : "text-white hover:text-zinc-900 hover:bg-white"
    }`,
    onClick: () => {
      setActive(index);
      fetchGetOrders(index, filter);
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
        </Button>,
      );
    }
    return buttons;
  };

  const nextPage = () => {
    if (active < pagination.total_pages) {
      const next = active + 1;
      setActive(next);
      fetchGetOrders(next, filter);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (active > 1) {
      const prev = active - 1;
      setActive(prev);
      fetchGetOrders(prev, filter);
      scrollToTop();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 pt-24 md:px-8 md:py-32 md:pb-0 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <div className="mb-8 hidden items-center gap-4 md:flex">
            <GoArrowLeft
              size={30}
              onClick={() => navigate("/")}
              className="cursor-pointer text-white transition-colors duration-300 hover:text-amber-500"
            />
            <span className="text-xl font-bold text-white">
              Kembali Ke Beranda
            </span>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800 backdrop-blur-sm">
            <div className="rounded-t-xl border-b border-zinc-700 bg-zinc-900 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Profile</h2>
            </div>

            <div className="flex py-8">
              <SidebarAkun />

              <div className="flex w-full flex-col items-center gap-8 md:w-[60%]">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white"
                >
                  Riwayat Pemesanan
                </motion.h2>

                <div className="w-[95%] space-y-6 px-4 md:w-[80%]">
                  <div className="flex justify-end gap-4">
                    <select
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setActive(1);
                        setLoading(true);
                        fetchGetOrders(1, e.target.value);
                        scrollToTop();
                      }}
                      className="cursor-pointer rounded border border-zinc-600 bg-zinc-800 px-4 py-2 text-white"
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="process">Process</option>
                      <option value="done">Done</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {loading ? (
                    <LoadingSpinner />
                  ) : ordersList.length > 0 ? (
                    ordersList.map((order) => (
                      <HistoryCard
                        key={order.id}
                        order={{ ...order, id: String(order.id) }}
                      />
                    ))
                  ) : (
                    <p className="mt-10 text-center text-white">
                      Tidak ada riwayat pemesanan.
                    </p>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Button
                    variant="text"
                    className="flex cursor-pointer items-center gap-2 text-white transition-transform duration-300 hover:scale-110"
                    onClick={prevPage}
                    disabled={active === 1}
                  >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />{" "}
                    Previous
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
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <NavbarProfile style={{ zIndex: 1 }} />
    </>
  );
};
