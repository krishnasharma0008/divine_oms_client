import React from "react";
import Image from "next/image";
import Link from "next/link";

const PJCustomerScreen = () => {
  return (
    <div className="font-body w-full min-h-screen flex flex-col gap-9 rounded">
      <div className="flex flex-wrap gap-x-4 gap-y-8">
        <div className="h-56 w-72 rounded-xl bg-white p-10 shadow-md text-center">
          <p className="text-2xl font-black mb-4">Choose order</p>
          <div className="border border-black p-4">
            <Link href="/choose-your-order">
              <div className="flex flex-row justify-center items-center">
                <Image
                  src="/icons8-order-100.png"
                  alt="Choose order"
                  width={869}
                  height={567}
                  className="h-[100px] w-auto cursor-pointer py-1"
                  layout="intrinsic"
                />
              </div>
            </Link>
            <p className="">Choose order</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PJCustomerScreen;
