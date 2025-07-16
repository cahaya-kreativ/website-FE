import React from "react";

export const Error404 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-900">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-9xl font-bold text-white">404</div>
        <div className="text-2xl font-semibold tracking-wider text-white">
          HALAMAN TIDAK DITEMUKAN
        </div>
      </div>
      <div className="cursor-pointer rounded-xl border-2 px-3 py-2 text-lg font-semibold text-white transition-all hover:border-white hover:bg-white hover:text-zinc-900">
        <a href="/">Kembali ke Homepage</a>
      </div>
    </div>
  );
};
