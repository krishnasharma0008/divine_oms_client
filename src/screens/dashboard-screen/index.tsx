"use client";

import LoaderContext from "@/context/loader-context";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { setCustType } from "@/local-storage";

const DashboardScreen = () => {
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(
    null
  );
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();

  const orderfor = async (orderType: string) => {
    showLoader();
    setSelectedOrderType(orderType);
    setCustType(orderType);
    if (orderType === "Jeweller") {
      await router.push("/choose-your-order");
    } else if (orderType === "Retail Customer") {
      await router.push("/customer-search");
    }
    hideLoader();
  };

  return (
    <div className="font-body h-screen flex items-center justify-center overflow-hidden">
      <div className="flex gap-x-4 gap-y-2 items-center justify-center">
        <div className="bg-[#F4F4F47A] w-auto rounded-3xl p-10 text-center border-[#888786] border-solid border-2">
          <p className="text-2xl font-black mb-10 underline">Place Order for</p>
          <div className="flex flex-wrap gap-x-12 gap-y-8 justify-center">
            <div
              className={`flex h-56 w-80 rounded-xl p-10 text-center items-center justify-center border-solid border-2 cursor-pointer transition-colors ${
                selectedOrderType === "Jeweller"
                  ? "border-[#000000] bg-gray-100"
                  : "border-[#B0B0B0] bg-white"
              }`}
              onClick={() => orderfor("Jeweller")}
            >
              <p className="font-medium text-xl font-black">Jeweller</p>
            </div>
            <div
              className={`flex h-56 w-80 rounded-xl p-10 text-center items-center justify-center border-solid border-2 cursor-pointer transition-colors ${
                selectedOrderType === "Retail Customer"
                  ? "border-[#000000] bg-gray-100"
                  : "border-[#B0B0B0] bg-white"
              }`}
              onClick={() => orderfor("Retail Customer")}
            >
              <p className="font-medium text-xl font-black">Retail Customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
