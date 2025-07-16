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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const fetchedCategories = useSelector(
    (state) => state.getCategories.categories,
  );
  const userProfile = useSelector((state) => state.authLogin.userProfile);
  const profile = useSelector((state) => state.authLogin.user); // State untuk jumlah notifikasi yang belum terbaca

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      const result = await dispatch(getNotificationsAction()); // Ambil notifikasi
      if (result && result.unreadCount !== undefined) {
        setUnreadNotificationsCount(result.unreadCount); // Set jumlah notifikasi yang belum terbaca
      }
    };

    fetchNotificationsCount(); // Panggil fungsi untuk mengambil jumlah notifikasi
  }, [dispatch]);

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  useEffect(() => {
    dispatch(getUserProfileAction()); // Fetch user profile on component mount
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

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  // Function to get initials from the user's full name
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
    <div className="fixed top-0 z-25 flex w-screen items-center justify-between bg-zinc-900 px-6 py-6 md:px-14 lg:px-28">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/")}
      >
        <img src={BrandLogo} alt="Brand Logo" className="w-[1.8rem]" />
        <div className="font-serif text-2xl font-semibold text-white md:text-3xl">
          Cahaya Kreativ
        </div>
      </div>

      <div className="flex gap-4 text-base text-white md:flex lg:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <IoNotifications size={30} className="hover:text-amber-400"/>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div className="cursor-pointer" onClick={toggleSidebar}>
          <AiOutlineMenu size={30} />
        </div>
      </div>
      <div className="hidden gap-10 text-base text-white md:hidden lg:flex">
        <Menu>
          <MenuHandler>
            <div className="cursor-pointer hover:text-amber-400">
              <span
                className="flex items-center gap-2 text-base font-medium hover:text-amber-400"
                onClick={handleCategoryClick}
              >
                Category{" "}
                {isMenuOpen ? (
                  <IoIosArrowUp size={20} />
                ) : (
                  <IoIosArrowDown size={20} />
                )}
              </span>
            </div>
          </MenuHandler>
          <MenuList className="z-30 w-64 p-4">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem
                  key={category.id}
                  className="cursor-pointer p-2 hover:bg-amber-500"
                  onClick={() => {
                    navigate(`/products?category=${category.name}`);
                    toggleMenu();
                  }}
                >
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem className="cursor-default p-2 text-gray-500">
                Tidak ada kategori tersedia
              </MenuItem>
            )}
          </MenuList>
        </Menu>
        <span
          className="cursor-pointer text-base font-medium hover:text-amber-400"
          onClick={() => navigate("/gallery")}
        >
          Gallery
        </span>
        <span
          className="cursor-pointer text-base font-medium hover:text-amber-400"
          onClick={() => navigate("/products")}
        >
          Product
        </span>
        <span
          className="cursor-pointer text-base font-medium hover:text-amber-400"
          onClick={() => navigate("/tentang-kami")}
        >
          Tentang Kami
        </span>
        <div className="flex gap-6 font-semibold">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/notification")}
          >
            <IoNotifications size={30} className="hover:text-amber-400"/>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <Menu>
            <MenuHandler>
              <Button
                className="cursor-pointer p-0 hover:text-amber-400"
                ripple={false}
                size="sm"
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full border-2 border-amber-500"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-black">
                    {getInitials(profile?.fullname || "")}
                  </div>
                )}
              </Button>
            </MenuHandler>
            <MenuList className="z-30 w-40 p-4">
              <MenuItem
                onClick={() => {
                  navigate("/profile-user");
                }}
                className="p-2 hover:border-zinc-900 hover:bg-amber-400"
              >
                <div className="flex items-center gap-3">
                  <FaUser size={17} />
                  <span>Profile</span>
                </div>
              </MenuItem>
              <MenuItem
                className="p-2 hover:bg-amber-400"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3">
                  <LuLogOut size={17} />
                  <span>Logout</span>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black/50"
          onClick={toggleSidebar}
        >
          <div className="fixed top-0 right-0 h-full w-64 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between pb-4">
              <div className="font-serif text-3xl font-semibold">
                Cahaya Kreativ
              </div>
              <button
                onClick={toggleSidebar}
                className="rounded-md border p-2 shadow-xl"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 py-4">
              <Menu>
                <MenuHandler>
                  <div className="cursor-pointer hover:text-amber-400">
                    <span
                      className="flex items-center gap-2 text-xl font-bold hover:text-amber-400"
                      onClick={handleCategoryClick}
                    >
                      Category{" "}
                      {isMenuOpen ? (
                        <IoIosArrowUp size={25} />
                      ) : (
                        <IoIosArrowDown size={25} />
                      )}
                    </span>
                  </div>
                </MenuHandler>
                <MenuList className="z-30 w-60 p-4">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        className="cursor-pointer p-2 hover:bg-amber-500"
                        onClick={() => {
                          navigate(`/products?category=${category.name}`);
                          toggleMenu();
                        }}
                      >
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem className="cursor-default p-2 text-gray-500">
                      Tidak ada kategori tersedia
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/gallery")}
              >
                Gallery
              </span>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/products")}
              >
                Product
              </span>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/tentang-kami")}
              >
                Tentang Kami
              </span>
              <span
                className="cursor-pointer text-xl font-bold hover:text-amber-400"
                onClick={() => navigate("/profile-user")}
              >
                Profile
              </span>
              <div className="flex items-center gap-3" onClick={handleLogout}>
                <LuLogOut size={25} />
                <span className="cursor-pointer text-xl font-bold hover:text-amber-400">
                  Logout
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
