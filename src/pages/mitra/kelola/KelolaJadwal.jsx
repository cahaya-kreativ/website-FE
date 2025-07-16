import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Component
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";
import {
  showLoadingToast,
  showSuccessToast,
} from "../../../helper/ToastHelper";

// Icons
import { CiMenuBurger } from "react-icons/ci";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";

// Redux
import {
  getScheduleAction,
  deleteScheduleAction,
  createScheduleAction,
} from "../../../redux/action/admin/schedule/getScheduleAction";

export const KelolaJadwal = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalType, setModalType] = useState(null);
  const [modalDate, setModalDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    duration: "",
    note: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    dispatch(getScheduleAction());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigasi ke bulan sebelumnya/berikutnya
  const handlePrevMonth = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1),
    );
  };

  // Format nama bulan
  const getMonthName = (date) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[date.getMonth()];
  };

  // Format nama hari lengkap
  const getDayNameFull = (date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[date.getDay()];
  };

  const scheduleWithDateObject = useSelector((state) =>
    state.getSchedule.schedule?.map((item) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
    })),
  );

  // Render semua jadwal tanpa filter bulan
  const renderAllSchedules = () => {
    if (!scheduleWithDateObject || scheduleWithDateObject.length === 0)
      return [];

    return scheduleWithDateObject
      .map((sched) => {
        if (sched.orders && sched.orders.length > 0) {
          return sched.orders.flatMap((order) =>
            order.orderDetails.map((detail) => ({
              id: sched.id,
              date: sched.date,
              productName: detail.product.name,
              label: detail.product.label,
              time: sched.time,
              endTime: sched.endTime,
              duration: sched.duration,
              isBooked: sched.isBooked,
              location: sched.location,
              note: sched.note,
              user: order.user.fullname,
            })),
          );
        } else {
          return {
            id: sched.id,
            date: sched.date,
            productName: null,
            label: null,
            time: sched.time,
            endTime: sched.endTime,
            duration: sched.duration,
            isBooked: sched.isBooked,
            location: sched.location,
            note: sched.note,
            user: null,
          };
        }
      })
      .flat();
  };

  const allScheduledEvents = renderAllSchedules();

  // Render jadwal berdasarkan tanggal
  const renderScheduleForDate = (date) => {
    const eventsForDay = allScheduledEvents.filter(
      (event) =>
        event.date && event.date.toDateString() === date.toDateString(),
    );

    if (eventsForDay.length > 0) {
      return (
        <div className="mt-1 space-y-1">
          {eventsForDay.map((event, idx) => {
            return (
              <span
                key={idx}
                className={`block rounded px-2 py-1 text-xs ${
                  event.productName ? "bg-blue-500" : "bg-zinc-700"
                } text-white`}
                onClick={() => openDetailModal(event.date)}
              >
                {event.productName
                  ? `${event.productName} - ${event.label}`
                  : `${event.time} - ${event.location}`}
                <br />
                <span className="text-[10px] text-white/80">
                  {event.user ? event.user : ""}
                </span>
              </span>
            );
          })}
        </div>
      );
    }

    return null;
  };

  // Buka modal
  const openDetailModal = (date) => {
    const selectedDateObj = new Date(date);
    const filtered = allScheduledEvents.filter(
      (e) => e.date?.toDateString() === selectedDateObj.toDateString(),
    );

    setModalType("detail");
    setModalDate(selectedDateObj);
    setModalData(filtered);
    setIsModalOpen(true);
  };

  const openCreateModal = (date) => {
    const selectedDateObj = new Date(date);
    setModalType("create");
    setModalDate(selectedDateObj);
    setFormData({
      date: selectedDateObj.toISOString().split("T")[0],
      time: "",
      location: "",
      duration: "",
      note: "",
    });
    setIsModalOpen(true);
  };

  // Tutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setModalData([]);
    setFormData({});
  };

  // Handle input change pada form create
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle hapus jadwal
  const handleDeleteSchedule = (id) => {
    setScheduleToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const loadingToastId = showLoadingToast("Loading ...");

    if (scheduleToDelete) {
      dispatch(deleteScheduleAction(scheduleToDelete));
      showSuccessToast("Delete Schedule Successfully");
      dispatch(getScheduleAction());
    }

    toast.dismiss(loadingToastId);
    dispatch(getScheduleAction());
    setIsDeleteConfirmOpen(false);
    setScheduleToDelete(null);
    closeModal();
  };

  const handleCreateSchedule = async () => {
    const loadingToastId = showLoadingToast("Loading ...");

    const formattedData = {
      ...formData,
      time: formData.time.replace(":", "."), // Contoh: "07:00" → "07.00"
    };

    const createSchedule = await dispatch(createScheduleAction(formattedData));
    toast.dismiss(loadingToastId);

    if (createSchedule) {
      showSuccessToast("Create Schedule Successfully!");
      setTimeout(() => {
        dispatch(getScheduleAction());
        closeModal();
        setFormData({});
      }, 1000);
    }
  };

  // Fungsi untuk mendapatkan jumlah hari dalam bulan
  const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Fungsi untuk mendapatkan hari pertama bulan
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Fungsi untuk menghitung grid 7x5 (35 hari)
  const getCalendarDays = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const lastDay = getLastDayOfMonth(date);

    // Hari-hari dari bulan ini
    const daysInMonth = [...Array(lastDay)].map((_, idx) => idx + 1);

    // Hari-hari dari bulan sebelumnya
    const prevMonthLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
    ).getDate();
    const prevDays = [...Array(firstDay)].map(
      (_, idx) =>
        new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          prevMonthLastDay - firstDay + idx + 1,
        ),
    );

    // Gabung semua hari untuk total 35 hari (grid 7x5)
    const fullGrid = [];

    for (let i = 0; i < 35; i++) {
      if (i < prevDays.length) {
        // Tanggal dari bulan lalu
        fullGrid.push({
          day: prevDays[i].getDate(),
          isCurrentMonth: false,
          date: prevDays[i],
        });
      } else if (i < prevDays.length + lastDay) {
        // Tanggal dari bulan saat ini
        const dayOfMonth = daysInMonth[i - prevDays.length];
        fullGrid.push({
          day: dayOfMonth,
          isCurrentMonth: true,
          date: new Date(date.getFullYear(), date.getMonth(), dayOfMonth),
        });
      } else {
        // Tanggal dari bulan depan
        const dayOfNextMonth = i - (prevDays.length + lastDay) + 1;
        fullGrid.push({
          day: dayOfNextMonth,
          isCurrentMonth: false,
          date: new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            dayOfNextMonth,
          ),
        });
      }
    }

    return fullGrid;
  };

  const calendarDays = getCalendarDays(selectedDate);

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
      <div className="flex h-screen overflow-hidden bg-zinc-900 text-white">
        {/* Mobile sidebar toggle button */}
        <button
          className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-200 shadow-md md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <CiMenuBurger className="h-5 w-5" />
        </button>

        {/* Sidebar */}
        <SidebarAdmin isOpen={sidebarOpen} onClose={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-full">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Kelola Jadwal</h1>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between">
              <button
                className="cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={() => openCreateModal(new Date())}
              >
                Tambah Jadwal
              </button>
              <div className="flex items-center space-x-4">
                <button
                  className="cursor-pointer text-white hover:text-blue-500"
                  onClick={handlePrevMonth}
                >
                  <GrFormPreviousLink size={24} />
                </button>
                <span className="text-xl font-semibold">
                  {getMonthName(selectedDate)} {selectedDate.getFullYear()}
                </span>
                <button
                  className="cursor-pointer text-white hover:text-blue-500"
                  onClick={handleNextMonth}
                >
                  <GrFormNextLink size={24} />
                </button>
              </div>
              <button
                className="cursor-pointer rounded-lg bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
                onClick={() => setSelectedDate(new Date())}
              >
                Hari Ini
              </button>
            </div>

            {/* Calendar */}
            <div className="mb-4 overflow-x-auto">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showMonthYearPicker
                dateFormat="MMMM yyyy"
                className="w-full rounded border border-zinc-700 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Schedule Grid 7x5 */}
            <div className="grid grid-cols-7 gap-2">
              {[
                "Minggu",
                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
              ].map((day, index) => (
                <div
                  key={index}
                  className="border border-zinc-700 p-2 text-center text-xs font-bold text-zinc-400"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((item, index) => {
                const currentDay = item.date; // Gunakan tanggal asli
                const isToday =
                  currentDay.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`border border-zinc-700 p-5 ${
                      item.isCurrentMonth
                        ? "cursor-pointer text-white hover:bg-zinc-700"
                        : "cursor-pointer text-zinc-500"
                    } ${
                      isToday && item.isCurrentMonth
                        ? "border-blue-500 bg-blue-900/50 ring-1 ring-blue-500"
                        : ""
                    }`}
                    title={getDayNameFull(currentDay)}
                    onClick={() => openDetailModal(currentDay)} // Gunakan tanggal asli
                  >
                    <span className="text-base font-bold">{item.day}</span>
                    {renderScheduleForDate(currentDay)}{" "}
                    {/* Gunakan tanggal asli */}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Modal Detail Jadwal */}
        {isModalOpen && modalType === "detail" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded bg-zinc-800 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Detail Jadwal {getDayNameFull(modalDate)}, {modalDate.getDate()}{" "}
                {getMonthName(modalDate)} {modalDate.getFullYear()}
              </h2>

              {/* List Jadwal dengan Tombol Hapus per Item */}
              {modalData.map((item, idx) => {
                if (item.productName) {
                  return (
                    <div
                      key={idx}
                      className="mb-4 rounded bg-blue-600 p-4 text-sm transition-all duration-200"
                    >
                      <p className="mb-1 text-base">
                        <strong>Produk:</strong> {item.productName}{" "}
                        {item.label && `- ${item.label}`}
                      </p>
                      <p className="mb-1 text-base">
                        <strong>Pelanggan:</strong> {item.user}
                      </p>
                      <p className="mb-1 text-base">
                        <strong>Waktu:</strong> {item.time} - {item.endTime}
                      </p>
                      <p className="mb-1 text-base">
                        <strong>Lokasi:</strong> {item.location}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          className="cursor-pointer rounded bg-red-500 px-3 py-1 text-base text-white hover:bg-red-600"
                          onClick={() => handleDeleteSchedule(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={idx}
                      className="mb-4 rounded bg-zinc-700 p-4 text-sm transition-all duration-200"
                    >
                      <p className="mb-1 text-base">
                        <strong>Waktu:</strong> {item.time} - {item.endTime}
                      </p>
                      <p className="mb-1 text-base">
                        <strong>Lokasi:</strong> {item.location}
                      </p>
                      {item.note && (
                        <p className="mb-1 text-base">
                          <strong>Catatan:</strong> {item.note}
                        </p>
                      )}
                      <div className="mt-3 flex justify-end">
                        <button
                          className="cursor-pointer rounded bg-red-500 px-3 py-1 text-base text-white hover:bg-red-600"
                          onClick={() => handleDeleteSchedule(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                }
              })}

              {/* Tombol Tutup Modal Detail */}
              <div className="mt-4 flex justify-end">
                <button
                  className="w-full cursor-pointer rounded bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
                  onClick={closeModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Create Jadwal */}
        {isModalOpen && modalType === "create" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded bg-zinc-800 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Buat Jadwal Baru
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    name="time"
                    placeholder="Masukkan waktu"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Durasi (jam)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="Durasi"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Masukkan lokasi"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Catatan
                  </label>
                  <textarea
                    name="note"
                    rows="3"
                    placeholder="Catatan tambahan"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-700 px-3 py-2 text-white"
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-800"
                    onClick={handleCreateSchedule}
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer rounded bg-zinc-500 px-4 py-2 text-white hover:bg-zinc-600"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded bg-zinc-800 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Konfirmasi Hapus Jadwal
              </h2>
              <p className="mb-4 text-white">
                Apakah Anda yakin ingin menghapus jadwal ini?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Ya, Hapus
                </button>
                <button
                  className="cursor-pointer rounded bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
