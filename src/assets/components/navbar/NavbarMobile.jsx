import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Material Tailwind Components
import { Dialog, DialogBody } from "@material-tailwind/react";

// Icons
import { IoHomeOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import { CiCircleList } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

// Redux Actions
import { logoutAction } from "../../../redux/action/user/auth/logoutAction";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

export const NavbarMobile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const token = CookieStorage.get(CookiesKeys.AuthToken);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <>
      <div className="fixed bottom-0 z-50 w-full shadow-xl">
        <div className="flex h-full items-center justify-between bg-white px-5 py-2">
          <div
            className="flex flex-col items-center justify-center gap-2"
            onClick={() => {
              navigate("/");
            }}
          >
            <div
              className={
                location.pathname === "/" ? `text-amber-500` : `text-zinc-900`
              }
            >
              <IoHomeOutline size={25} />
            </div>
            <span
              className={`text-sm ${
                location.pathname === "/"
                  ? `font-semibold text-amber-500`
                  : `text-zinc-900`
              }`}
            >
              Home
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-2"
            onClick={() => {
              navigate("/notification");
            }}
          >
            <div
              className={
                location.pathname === "/notification"
                  ? `text-amber-500`
                  : `text-zinc-900`
              }
            >
              <IoNotificationsOutline size={25} />
            </div>
            <span
              className={`text-sm ${
                location.pathname === "/notification"
                  ? `font-semibold text-amber-500`
                  : `text-zinc-900`
              }`}
            >
              Notifikasi
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-2"
            onClick={() => {
              navigate("/kelas-saya");
            }}
          >
            <div
              className={
                location.pathname === "/kelas-saya"
                  ? `text-amber-500`
                  : `text-zinc-900`
              }
            >
              <FaRegCirclePlay size={25} />
            </div>
            <span
              className={`text-sm ${
                location.pathname === "/kelas-saya"
                  ? `font-semibold text-amber-500`
                  : `text-zinc-900`
              }`}
            >
              Kelas
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-2"
            onClick={() => {
              navigate("/all-kelas");
            }}
          >
            <div
              className={
                location.pathname === "/all-kelas" ||
                location.pathname === "/pilih-gratis" ||
                location.pathname === "/pilih-premium"
                  ? `text-amber-500`
                  : `text-zinc-900`
              }
            >
              <CiCircleList size={25} />
            </div>
            <span
              className={`text-sm ${
                location.pathname === "/all-kelas" ||
                location.pathname === "/pilih-gratis" ||
                location.pathname === "/pilih-premium"
                  ? `font-semibold text-amber-500`
                  : `text-zinc-900`
              }`}
            >
              Kursus
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-2"
            onClick={handleOpen}
          >
            <div
              className={
                location.pathname === "/profile-user" ||
                location.pathname === "/password-user" ||
                location.pathname === "/history"
                  ? `text-amber-500`
                  : `text-zinc-900`
              }
            >
              <FaRegUser size={25} />
            </div>
            <span
              className={`text-sm ${
                location.pathname === "/profile-user" ||
                location.pathname === "/password-user" ||
                location.pathname === "/history"
                  ? `font-semibold text-amber-500`
                  : `text-zinc-900`
              }`}
            >
              Akun
            </span>
          </div>
        </div>
      </div>

      {/* Dialog Navbar Mobile */}
      <Dialog open={open} handler={handleOpen} className="mx-5 my-48 w-fit">
        <DialogBody className="mx-auto w-[22rem] rounded-lg border border-zinc-900 bg-white shadow-lg">
          {token !== undefined ? (
            <>
              <div
                className="flex cursor-pointer items-center gap-3 border-b-2 border-slate-300 py-4 hover:text-amber-500"
                onClick={() => {
                  navigate("/profile-user");
                }}
              >
                <div>
                  <LuPenLine size={25} />
                </div>
                <div className="text-md font-semibold">Profil Saya</div>
              </div>

              <div
                className="flex cursor-pointer items-center gap-3 border-b-2 border-slate-300 py-4 hover:text-amber-500"
                onClick={() => {
                  navigate("/password-user");
                }}
              >
                <div>
                  <IoSettingsOutline size={25} />
                </div>
                <div className="text-md font-semibold">Ubah Password</div>
              </div>

              <div
                className="flex cursor-pointer items-center gap-3 border-b-2 border-slate-300 py-4 hover:text-amber-500"
                onClick={() => {
                  navigate("/history");
                }}
              >
                <div>
                  <MdOutlineShoppingCart size={25} />
                </div>
                <div className="text-md font-semibold">Riwayat Pemesanan</div>
              </div>

              <div
                className="flex cursor-pointer items-center gap-3 py-4 hover:text-amber-500"
                onClick={handleLogout}
              >
                <div>
                  <LuLogOut size={25} />
                </div>
                <div className="text-md font-semibold">Keluar</div>
              </div>
            </>
          ) : (
            <div
              className="flex cursor-pointer items-center gap-3 py-4 hover:text-amber-500"
              onClick={() => {
                navigate("/login");
              }}
            >
              <div>
                <LuLogOut size={25} />
              </div>
              <div className="text-md font-semibold">Masuk</div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
};
