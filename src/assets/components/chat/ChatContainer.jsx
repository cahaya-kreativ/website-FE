import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { IoIosSend } from "react-icons/io";
import BrandLogo from "../../img/logogram-putih.png";

// Framer Motion
import { motion } from "framer-motion";

// Redux Action
import {
  createChatAction,
  fetchChatBetweenUsers,
} from "../../../redux/action/user/chat/chattingAction";

export const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]); // State lokal untuk menampilkan chat
  const textareaRef = useRef(null);
  const chatBoxRef = useRef(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authLogin);
  const chattingState = useSelector((state) => state.chatting);

  const userId = auth.user?.id;
  const role = auth.user?.role;

  // Auto resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Fetch chat saat mount
  useEffect(() => {
    if (userId && role === "user") {
      dispatch(fetchChatBetweenUsers(userId, 1));
    }
  }, [dispatch, userId, role]);

  // Sinkronkan Redux ke state lokal
  useEffect(() => {
    if (Array.isArray(chattingState?.chats)) {
      setChats([...chattingState.chats]);
    }
  }, [chattingState?.chats]);

  // Scroll otomatis ke bawah
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chats]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const payload = { message };

    try {
      const result = await dispatch(createChatAction(payload));

      if (result.status && result.data) {
        setChats((prev) => {
          const alreadyExists = prev.some((chat) => chat.id === result.data.id);
          if (alreadyExists) return prev;
          return [...prev, result.data];
        });
        setMessage(""); // Kosongkan input
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  // Format waktu jam:menit
  const formatTime = (timestamp) => {
    const timePart = timestamp.split(" ")[1]; // "19:28:40"
    return timePart.slice(0, 5); // "19:28"
  };

  // Ambil label hari/tanggal
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

    return msgDate.toLocaleDateString("en-ID", {
      day: "numeric",
      month: "short",
      year: diffDays > 365 ? "numeric" : undefined,
    });
  };

  // Kelompokkan chat berdasarkan label hari
  const groupedChats = chats.reduce((groups, chat) => {
    const label = getDayLabel(chat.createdAt);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(chat);
    return groups;
  }, {});

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={BrandLogo}
              alt="Admin"
              className="h-10 w-10 rounded-full bg-white object-cover"
            />
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-medium text-white">
              Customer Services
            </h1>
            <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area - Full Width + Scroll */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-6 py-2"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="w-full space-y-4">
          {chattingState.loading ? (
            <p className="text-center text-zinc-400">Memuat pesan...</p>
          ) : chats.length === 0 ? (
            <p className="text-center text-zinc-400">Belum ada pesan.</p>
          ) : (
            Object.keys(groupedChats).map((label, index) => (
              <React.Fragment key={index}>
                <div className="my-4 text-center">
                  <span className="inline-block rounded-full bg-zinc-800 px-4 py-1 text-xs text-zinc-400">
                    {label}
                  </span>
                </div>
                {groupedChats[label].map((msg) => {
                  const isSelf = msg.sender_id === userId;
                  const bgColor = isSelf ? "bg-blue-500" : "bg-zinc-800";
                  const formattedTime = formatTime(msg.createdAt);

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1 }}
                      className={`mb-4 ${isSelf ? "text-right" : "text-left"}`}
                    >
                      <p
                        className={`inline-block max-w-xs rounded-lg ${bgColor} px-4 py-2 text-white`}
                      >
                        {msg.message}
                      </p>
                      <span
                        className={`mt-1 block ${isSelf ? "text-right" : "text-left"} text-xs ${isSelf ? "text-amber-100" : "text-zinc-400"}`}
                      >
                        {formattedTime} WIB
                      </span>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Input Area - Full Width */}
      <div className="border-t border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="flex w-full items-center gap-4">
          <input
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="w-full resize-none rounded-lg bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 outline-none"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            className="cursor-pointer rounded-xl bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
            aria-label="Send message"
          >
            <IoIosSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
