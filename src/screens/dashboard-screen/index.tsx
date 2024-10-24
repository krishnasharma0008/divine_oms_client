"use client";

import LoaderContext from "@/context/loader-context";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
//import Image from "next/image";
//import Link from "next/link";

const DashboardScreen = () => {
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(
    null
  );
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();

  const orderfor = (orderType: string) => {
    showLoader();
    setSelectedOrderType(orderType);
    console.log(selectedOrderType);
    hideLoader();
  };

  const orderforselection = () => {
    showLoader();
    //console.log(orderType); //
    if (selectedOrderType === "PJ/Jeweller") {
      router.push("/pj-customer");
    }
    if (selectedOrderType === "Retail Customer") {
      router.push("/customer-search");
    }
    hideLoader();
  };

  return (
    <div className="font-body w-full min-h-screen flex flex-col gap-9 rounded items-center justify-center ">
      <div className="flex flex-wrap gap-x-4 gap-y-8 items-center justify-center">
        <div className="bg-[#F4F4F47A] h-auto w-auto rounded-3xl bg-white p-10 text-center border-[#888786] border-solid border-2">
          <p className="text-2xl font-black mb-10 underline">Place Order for</p>
          <div className="flex flex-wrap gap-x-12 gap-y-8 justify-center">
            <div
              className={`flex h-56 w-80 rounded-xl bg-white p-10 text-center items-center justify-center border-solid border-2 ${
                selectedOrderType === "PJ/Jeweller"
                  ? "border-[#000000]" // Change border color when selected
                  : "border-[#B0B0B0]" // Default border color
              }`}
              onClick={() => orderfor("PJ/Jeweller")}
            >
              {/* <Link href="/choose-your-order"> */}
              <p className="font-medium text-xl font-black">
                Customer/Jeweller
              </p>
              {/* </Link> */}
            </div>
            <div
              className={`flex h-56 w-80 rounded-xl bg-white p-10 text-center items-center justify-center border-solid border-2 ${
                selectedOrderType === "Retail Customer"
                  ? "border-[#000000]" // Change border color when selected
                  : "border-[#B0B0B0]" // Default border color
              }`}
              onClick={() => orderfor("Retail Customer")}
            >
              {/* <Link href="/"> */}
              <p className="font-medium text-xl font-black">Retail Customer</p>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
      {/* Button added below the "Place Order for" section */}
      <div className="w-96">
        <button
          type="button"
          className={`w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-black focus:outline-none
            ${!selectedOrderType ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={orderforselection}
          disabled={!selectedOrderType} // Disable button when loading
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
