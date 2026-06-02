import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { IoNotifications } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import BrandLogo from "../../img/logogram_hitam.png";

// Material Tailwind Components
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

// Redux Actions
import { logoutAction } from "../../../redux/action/user/auth/logoutAction";
import { getCategoriesAction } from "../../../redux/action/admin/categories/getCategoriesAction";
import { getUserProfileAction } from "../../../redux/action/user/profile/profileUserAction";
import { getNotificationsAction } from "../../../redux/action/user/notification/getNotificationsAction";

export const NavbarLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const fetchedCategories = useSelector(
    (state) => state.getCategories.categories,
  );
  const userProfile = useSelector((state) => state.authLogin.userProfile);
  const profile = useSelector((state) => state.authLogin.user);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      const result = await dispatch(getNotificationsAction());
      if (result && result.unreadCount !== undefined) {
        setUnreadNotificationsCount(result.unreadCount);
      }
    };
    fetchNotificationsCount();
  }, [dispatch]);

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategoryClick = () => {
    dispatch(getCategoriesAction());
    toggleMenu();
  };

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    return names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 z-50 w-full flex items-center justify-between bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4 transition-transform duration-300 md:px-14 lg:px-24 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className="flex cursor-pointer items-center gap-3"
        onClick={() => navigate("/")}
      >
        <img src={BrandLogo} alt="Brand Logo" className="w-[2.2rem] brightness-0 invert" />
        <div className="font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hidden sm:block md:text-2xl">
          CAHAYA <span className="text-amber-500">KREATIV</span>
        </div>
      </div>

      {/* Mobile Toggle & Icons */}
      <div className="flex items-center gap-5 text-white lg:hidden">
        <div
          className="relative cursor-pointer transition-transform hover:scale-110"
          onClick={() => navigate("/notification")}
        >
          <IoNotifications size={28} className="hover:text-amber-500 transition-colors" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg border border-zinc-950">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div className="cursor-pointer hover:text-amber-500 transition-colors" onClick={toggleSidebar}>
          <AiOutlineMenu size={28} />
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
        <Menu>
          <MenuHandler>
            <div className="cursor-pointer group flex items-center gap-2 hover:text-amber-500 transition-colors">
              <span className="flex items-center gap-2" onClick={handleCategoryClick}>
                Category
                {isMenuOpen ? (
                  <IoIosArrowUp size={16} className="text-amber-500" />
                ) : (
                  <IoIosArrowDown size={16} className="group-hover:text-amber-500 transition-colors" />
                )}
              </span>
            </div>
          </MenuHandler>
          <MenuList className="z-50 w-64 border-zinc-700 bg-zinc-900 p-3 text-white shadow-xl shadow-black/50">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem
                  key={category.id}
                  className="cursor-pointer p-3 font-medium transition-colors hover:bg-amber-500 hover:text-zinc-900 focus:bg-amber-500 focus:text-zinc-900 rounded-lg"
                  onClick={() => {
                    navigate(`/products?category=${category.name}`);
                    toggleMenu();
                  }}
                >
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem className="cursor-default p-3 text-gray-500">
                Tidak ada kategori tersedia
              </MenuItem>
            )}
          </MenuList>
        </Menu>
        
        <span
          className="cursor-pointer hover:text-amber-500 transition-colors"
          onClick={() => navigate("/gallery")}
        >
          Gallery
        </span>
        <span
          className="cursor-pointer hover:text-amber-500 transition-colors"
          onClick={() => navigate("/products")}
        >
          Product
        </span>
        <span
          className="cursor-pointer hover:text-amber-500 transition-colors"
          onClick={() => navigate("/tentang-kami")}
        >
          Tentang Kami
        </span>
        
        <div className="flex items-center gap-6 border-l border-zinc-700 pl-6 ml-2">
          {/* Notifications */}
          <div
            className="relative cursor-pointer transition-transform hover:scale-110"
            onClick={() => navigate("/notification")}
          >
            <IoNotifications size={24} className="hover:text-amber-500 transition-colors" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg border border-zinc-950">
                {unreadNotificationsCount}
              </span>
            )}
          </div>

          {/* User Profile Dropdown */}
          <Menu>
            <MenuHandler>
              <Button
                className="cursor-pointer p-0 m-0 bg-transparent shadow-none hover:shadow-none focus:shadow-none active:shadow-none hover:scale-105 transition-transform"
                ripple={false}
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full border-2 border-amber-500 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-zinc-900">
                    {getInitials(profile?.fullname || "")}
                  </div>
                )}
              </Button>
            </MenuHandler>
            <MenuList className="z-50 w-48 border-zinc-700 bg-zinc-900 p-2 text-white shadow-xl shadow-black/50">
              <MenuItem
                onClick={() => navigate("/profile-user")}
                className="flex items-center gap-3 p-3 font-medium transition-colors hover:bg-amber-500 hover:text-zinc-900 rounded-lg mb-1"
              >
                <FaUser size={16} />
                <span>Profil Anda</span>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white rounded-lg"
              >
                <LuLogOut size={16} />
                <span>Keluar</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800 p-6 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
              <div className="font-serif text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                CAHAYA <span className="text-amber-500">KREATIV</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="rounded-full bg-zinc-900 p-2 text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-lg font-medium text-gray-300 flex-grow">
              {/* User Identity Mobile */}
              <div className="flex items-center gap-4 mb-2 pb-6 border-b border-zinc-800/50" onClick={() => { navigate("/profile-user"); toggleSidebar(); }}>
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="User Avatar" className="h-12 w-12 rounded-full border-2 border-amber-500 object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-zinc-900">
                    {getInitials(profile?.fullname || "")}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-bold">{profile?.fullname || "Profil"}</span>
                  <span className="text-sm text-amber-500">Lihat Profil</span>
                </div>
              </div>

              <Menu>
                <MenuHandler>
                  <div className="cursor-pointer hover:text-amber-500 transition-colors">
                    <span
                      className="flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      Category
                      {isMenuOpen ? (
                        <IoIosArrowUp size={20} className="text-amber-500" />
                      ) : (
                        <IoIosArrowDown size={20} />
                      )}
                    </span>
                  </div>
                </MenuHandler>
                <MenuList className="z-[70] w-60 border-zinc-800 bg-zinc-900 p-3 text-white shadow-2xl">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        className="cursor-pointer p-3 hover:bg-amber-500 hover:text-zinc-900 focus:bg-amber-500 focus:text-zinc-900 rounded-lg"
                        onClick={() => {
                          navigate(`/products?category=${category.name}`);
                          toggleSidebar();
                        }}
                      >
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem className="cursor-default p-3 text-gray-500">
                      Tidak ada kategori tersedia
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
              
              <span
                className="cursor-pointer hover:text-amber-500 transition-colors border-b border-zinc-800/50 pb-4"
                onClick={() => { navigate("/gallery"); toggleSidebar(); }}
              >
                Gallery
              </span>
              <span
                className="cursor-pointer hover:text-amber-500 transition-colors border-b border-zinc-800/50 pb-4"
                onClick={() => { navigate("/products"); toggleSidebar(); }}
              >
                Product
              </span>
              <span
                className="cursor-pointer hover:text-amber-500 transition-colors border-b border-zinc-800/50 pb-4"
                onClick={() => { navigate("/tentang-kami"); toggleSidebar(); }}
              >
                Tentang Kami
              </span>
            </div>
            
            {/* Mobile Logout Button */}
            <div className="mt-auto pt-6 border-t border-zinc-800">
              <div
                className="flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 py-4 text-xl font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                onClick={handleLogout}
              >
                <LuLogOut size={24} />
                <span>Keluar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
