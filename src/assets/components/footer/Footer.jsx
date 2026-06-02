import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaWhatsappSquare } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-950 pt-16 pb-8 text-white border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-24 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              CAHAYA <span className="text-amber-500">KREATIV</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Studio kreatif dan teknologi yang berdedikasi menghadirkan layanan dokumentasi profesional serta solusi IT & software inovatif. Kami siap membangun website company profile, aplikasi custom, hingga sistem ERP/WMS untuk mendorong transformasi digital bisnis Anda.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 hover:text-amber-400 transition-colors">
                <MdEmail className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span className="text-sm md:text-base">cahayakreativ@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 hover:text-amber-400 transition-colors">
                <MdPhone className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span className="text-sm md:text-base">0851-9590-6893 (WA)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 hover:text-amber-400 transition-colors">
                <MdLocationOn className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                <span className="text-sm md:text-base leading-relaxed">
                  Jl. Karangklumprik Tim II, Surabaya, Indonesia
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Ikuti Kami</h3>
            <p className="text-sm text-gray-400">Temukan inspirasi dan karya terbaru kami di media sosial.</p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/cahaya.kreativ/"
                target="_blank" rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:bg-amber-500 hover:border-amber-500"
              >
                <FaInstagramSquare size={24} className="text-gray-400 group-hover:text-zinc-900 transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@cahaya.kreativ"
                target="_blank" rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:bg-amber-500 hover:border-amber-500"
              >
                <AiFillTikTok size={24} className="text-gray-400 group-hover:text-zinc-900 transition-colors" />
              </a>
              <a
                href="https://wa.me/6285195906893"
                target="_blank" rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:bg-amber-500 hover:border-amber-500"
              >
                <FaWhatsappSquare size={24} className="text-gray-400 group-hover:text-zinc-900 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-zinc-800/50 pt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Cahaya Kreativ. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <span className="cursor-pointer hover:text-amber-500 transition-colors">Syarat & Ketentuan</span>
            <span className="cursor-pointer hover:text-amber-500 transition-colors">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
