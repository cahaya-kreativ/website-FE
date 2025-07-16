import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import { SidebarAdmin } from "../../../assets/components/sidebar/SidebarAdmin";

// Redux Actions
import { getCustomersAction } from "../../../redux/action/admin/dashboard/GetCustomersAction";
import {
  getChatAdminAction,
  createChatAdminAction,
} from "../../../redux/action/admin/chat/chatAdminAction";

// Icons
import { CiMenuBurger } from "react-icons/ci";

export const ChatAdmin = () => {
  const dispatch = useDispatch();
  const selectedUserId = useSelector((state) => state.getChatAdmin.selectedUserId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatData, setChatData] = useState([]);
  const messagesEndRef = useRef(null);

  // Ambil data dari Redux
  const users = useSelector((state) => state.getCustomer.customers || []);
  const chatState = useSelector((state) => state.getChatAdmin.chat);
  const auth = useSelector((state) => state.authLoginAdmin);
  const adminId = auth.admin?.id;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (chatState && Array.isArray(chatState)) {
      setChatData(chatState);
    }
    dispatch(getCustomersAction());
  }, [dispatch, chatState]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(getChatAdminAction(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  // Saat user dipilih, ambil chat antara admin dan user tsb
  const handleSelectUser = (userId) => {
    dispatch(getChatAdminAction(userId));
    setSearchTerm("");
  };

  // Scroll ke bawah otomatis saat chatData berubah
  useEffect(() => {
    const chatBox = messagesEndRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatData]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const payload = {
      message: newMessage,
      receiverId: selectedUserId,
    };

    try {
      const result = await dispatch(createChatAdminAction(payload));

      if (result.status && result.data) {
        setChatData((prev) => {
          const alreadyExists = prev.some((chat) => chat.id === result.data.id);
          if (alreadyExists) return prev;
          return [...prev, result.data.data];
        });
        setNewMessage("");
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  // Format waktu jam:menit
  const formatTime = (timestamp) => {
    if (!timestamp) return "Waktu tidak tersedia";
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} WIB`;
  };

  const getDayLabel = (timestamp) => {
    const today = new Date();
    const msgDate = new Date(timestamp);
    const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[msgDate.getDay()];
    }
    return msgDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Kelompokkan chat berdasarkan tanggal/hari
  const filteredChatData = chatData.filter((chat) =>
    chat.message.toLowerCase().includes(chatSearchTerm.toLowerCase()),
  );

  const groupedChats = filteredChatData.reduce((groups, chat) => {
    const label = getDayLabel(chat.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
    return groups;
  }, {});

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    const initials = names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-900">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-200 shadow-md md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <CiMenuBurger className="h-5 w-5" />
      </button>
      {/* Sidebar Admin */}
      <SidebarAdmin
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Konsultasi Chat</h1>
          </div>
          {/* Chat Interface */}
          <div className="flex gap-4">
            {/* Sidebar: Daftar Semua Customer */}
            <div className="w-[30%] rounded-lg bg-zinc-800 p-4">
              <h2 className="mb-4 px-4 text-lg font-semibold text-white">
                Customer
              </h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <ul className="max-h-[525px] space-y-3 overflow-y-auto py-3">
                {users
                  .filter((user) =>
                    user.fullname
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user.id)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg p-4 hover:bg-zinc-700 ${
                        selectedUserId === user.id ? "bg-zinc-700" : ""
                      }`}
                    >
                      {/* Avatar atau Initial */}
                      {user.profile?.avatar_url ? (
                        <img
                          src={user.profile.avatar_url}
                          alt={user.fullname}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600">
                          <span className="text-xs font-medium text-white">
                            {getInitials(user.fullname)}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {user.fullname}
                        </span>
                        <span className="truncate text-sm text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Main Chat Area */}
            <div className="w-[70%] rounded-lg bg-zinc-800 p-4">
              {selectedUserId ? (
                <div className="flex h-full flex-col">
                  {/* Header Chat */}
                  <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {users.find((u) => u.id === selectedUserId)?.profile
                        ?.avatar_url ? (
                        <img
                          src={
                            users.find((u) => u.id === selectedUserId)?.profile
                              ?.avatar_url
                          }
                          alt={
                            users.find((u) => u.id === selectedUserId)
                              ?.fullname || "User Profile"
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-600">
                          <span className="text-sm font-medium text-white">
                            {getInitials(
                              users.find((u) => u.id === selectedUserId)
                                ?.fullname,
                            )}
                          </span>
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-semibold text-white">
                          {users.find((u) => u.id === selectedUserId)?.fullname}
                        </h2>
                        <p className="text-xs text-gray-400">
                          Online{" "}
                          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                        </p>
                      </div>
                    </div>
                    {/* Input Pencarian Chat */}
                    <div className="hidden md:block">
                      <input
                        type="text"
                        value={chatSearchTerm}
                        onChange={(e) => setChatSearchTerm(e.target.value)}
                        placeholder="Cari pesan..."
                        className="w-64 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  {/* Area Chat */}
                  <div
                    className="flex-1 overflow-y-auto rounded-lg px-4 py-2"
                    ref={messagesEndRef}
                    style={{ maxHeight: "470px" }}
                  >
                    {Object.keys(groupedChats).length > 0 ? (
                      Object.keys(groupedChats).map((label, index) => (
                        <React.Fragment key={index}>
                          {/* Label Hari/Tanggal */}
                          <div className="my-4 text-center">
                            <span className="inline-block rounded-full border bg-zinc-900 px-4 py-1 text-xs text-zinc-400">
                              {label}
                            </span>
                          </div>
                          {/* Pesan-pesan di hari tersebut */}
                          {groupedChats[label].map((msg) => {
                            const isSelf = msg.sender_id === adminId;
                            return (
                              <div
                                key={msg.id}
                                className={`my-2 ${isSelf ? "text-right" : "text-left"}`}
                              >
                                <p
                                  className={`inline-block max-w-xs rounded-lg ${
                                    isSelf
                                      ? "bg-blue-500 text-white"
                                      : "bg-zinc-600 text-white"
                                  } px-4 py-2`}
                                >
                                  {msg.message}
                                </p>
                                <span
                                  className={`mt-1 block text-xs text-gray-400 ${
                                    isSelf ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatTime(msg.createdAt)}
                                </span>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-center text-gray-400">
                          Belum ada pesan.
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Input & Button Send */}
                  <div className="flex items-center gap-2 border-t border-zinc-700 bg-zinc-800 px-4 py-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Tulis pesan..."
                      className="flex-1 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <h3 className="text-xl text-white">
                    Pilih pengguna untuk mulai chat
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Silakan klik salah satu pengguna di sidebar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
