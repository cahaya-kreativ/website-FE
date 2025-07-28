import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { CgLogIn } from "react-icons/cg";
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
import { getCategoriesAction } from "../../../redux/action/admin/categories/getCategoriesAction";

export const NavbarHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const fetchedCategories = useSelector(
    (state) => state.getCategories.categories,
  );

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

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

  return (
    <div
      className={`fixed top-0 z-25 w-screen items-center justify-between bg-zinc-900 px-6 py-6 transition-transform duration-300 md:px-14 lg:px-28 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } flex`}
    >
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/")}
      >
        <img src={BrandLogo} alt="Brand Logo" className="w-[1.8rem]" />
        <div className="font-serif text-3xl font-semibold text-white">
          Cahaya Kreativ
        </div>
      </div>
      <div className="flex gap-10 text-base text-white md:flex lg:hidden">
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
        <div
          className="flex cursor-pointer gap-2 font-semibold text-white hover:text-amber-400"
          onClick={() => navigate("/login")}
        >
          <CgLogIn size={30} />
          <div className="text-xl">Masuk</div>
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
              {/* <img src={BrandLogo} alt="Brand Logo" className="w-[2.5rem]" /> */}
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
              <div
                className="flex cursor-pointer gap-2 py-4 text-3xl font-bold text-black hover:text-amber-400 md:py-10"
                onClick={() => navigate("/login")}
              >
                <CgLogIn size={40} />
                <div>Masuk</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
