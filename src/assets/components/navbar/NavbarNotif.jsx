import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { LuLogOut } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import BrandLogo from "../../img/logogram_hitam.png";

// Redux Actions
import { logoutAction } from "../../../redux/action/user/auth/logoutAction";
import { getUserProfileAction } from "../../../redux/action/user/profile/profileUserAction";

// Material Tailwind Components
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

export const NavbarNotif = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const userProfile = useSelector((state) => state.authLogin.userProfile);
  const profile = useSelector((state) => state.authLogin.user);

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  useEffect(() => {
    dispatch(getUserProfileAction()); // Fetch user profile on component mount
  }, [dispatch]);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll ke bawah
        setShowNavbar(false);
      } else {
        // Scroll ke atas
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
      className={`fixed top-0 z-25 flex w-screen items-center justify-between gap-2 bg-zinc-900 px-4 py-6 transition-transform duration-300 md:px-10 lg:px-28 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex gap-10">
        <div
          className="flex cursor-pointer items-center justify-center gap-2"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={BrandLogo} alt="Brand Logo" className="w-[1.8rem]" />
          <div className="gap-4 font-serif text-2xl font-semibold text-white md:text-3xl">
            Cahaya Kreativ
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-white md:gap-8 lg:gap-8">
        <div className="hidden cursor-pointer gap-2 rounded-xl bg-white px-2 py-2 font-bold text-black md:flex lg:flex lg:px-6 lg:py-1">
          <IoNotifications size={30} />
          <div className="md:text-xl">Notification</div>
        </div>
        <Menu>
          <MenuHandler>
            <Button
              className="cursor-pointer p-1 hover:text-amber-400"
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
          <MenuList className="w-40 p-4">
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
            <MenuItem className="p-2 hover:bg-amber-400" onClick={handleLogout}>
              <div className="flex items-center gap-3">
                <LuLogOut size={17} />
                <span>Logout</span>
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};
