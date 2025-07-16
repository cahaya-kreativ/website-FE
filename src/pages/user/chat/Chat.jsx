import React, { useState } from "react";

// Component
import { SidebarChat } from "../../../assets/components/chat/SidebarChat";
import { ChatContainer } from "../../../assets/components/chat/ChatContainer";

// Icons
import { CiMenuBurger } from "react-icons/ci";

export const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-900">
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800 p-2 text-zinc-200 shadow-md md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <CiMenuBurger className="h-5 w-5" />
      </button>

      {/* Sidebar - hidden on mobile by default, toggled with the button */}
      <SidebarChat isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main chat container */}
      <ChatContainer />
    </div>
  );
};
