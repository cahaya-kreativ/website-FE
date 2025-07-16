import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaWhatsappSquare } from "react-icons/fa";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-900 py-4 md:py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-20">
          {/* Company Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold">CAHAYA KREATIV</h2>
            <p className="text-gray-300">
              Studio kreatif yang berdedikasi untuk menghadirkan solusi visual
              terbaik dengan standar profesional. Kami menggabungkan keahlian
              teknis dan kreativitas untuk menciptakan hasil yang memukau.
            </p>
            <p className="text-sm text-gray-400">
              ©2025. Cahaya Kreativ. All Rights Reserved.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Hubungi Kami</h2>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <span className="block">cahayakreativ@gmail.com</span>
              </p>
              <p className="flex items-center text-gray-300">
                <span className="block">0851-9590-6893 (WA)</span>
              </p>
              <div className="pt-2">
                <p className="text-gray-300">
                  Jl. Jambu V, Pondok Tjandra, Surabaya, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6 pb-10">
            <h2 className="text-xl font-bold">Ikuti Kami</h2>
            <div className="flex flex-wrap gap-4">          
              <a
                href="https://www.instagram.com/cahaya.kreativ/"
                className="transform text-gray-300 transition-colors duration-300 hover:text-amber-500"
              >
                <FaInstagramSquare size={40} />
              </a>
              <a
                href="https://www.tiktok.com/@cahaya.kreativ"
                className="transform text-gray-300 transition-colors duration-300 hover:text-amber-500"
              >
                <AiFillTikTok size={40} />
              </a>
              <a
                href="https://wa.me/6285195906893"
                className="Transform text-gray-300 transition-colors duration-300 hover:text-amber-500"
              >
                <FaWhatsappSquare size={40} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
