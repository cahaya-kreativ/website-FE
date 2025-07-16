import React from "react";

// Icons
import { FcGoogle } from "react-icons/fc";

export const Google = () => {
  const handleLoginGoogle = async () => {
    window.location =
      "https://cahaya-kreativ-be.vercel.app/api/v1/users/google";
  };

  return (
    <div
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-black bg-white py-2 hover:bg-slate-200"
      onClick={handleLoginGoogle}
    >
      <FcGoogle size={30} />
      <span className="font-semibold">Masuk dengan Google</span>
    </div>
  );
};
