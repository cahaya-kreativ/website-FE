import React, { useEffect, useState } from "react";
import { CheckCircle, Download } from "lucide-react";

export const DonePayment = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div
          className={`transform text-center transition-all duration-1000 ${
            isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mb-8 text-gray-600">Thank you for your purchase</p>
        </div>

        <div
          className={`mb-6 transform rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all delay-200 duration-1000 ${
            isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">ORD-20240312</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">March 12, 2024</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-gray-800">Total Amount</span>
              <span className="text-primary-600 font-bold">Rp 1.837.800</span>
            </div>
          </div>
        </div>

        <div
          className={`flex transform gap-4 transition-all delay-400 duration-1000 ${
            isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-5 w-5" />
            Invoice
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary-600 hover:bg-primary-700 flex-1 rounded-lg px-4 py-3 font-medium text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
