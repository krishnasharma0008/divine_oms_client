"use client";

import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname
import LoginScreenMobileInput from "./sub-components/login-screen-mobile";
//import LoginScreenOtp from "./sub-components/login-screen-otp";

const LoginScreen: React.FC = () => {
  const pathname = usePathname(); // use usePathname to get the current path

  return (
    <div className="flex flex-col items-center md:flex-row flex-row min-h-screen max-h-screen">
      <div className="flex items-center justify-center w-full max-w h-screen basis-1/2">
        {pathname === "/login" && <LoginScreenMobileInput />}
        {/* {pathname === "/login/verify" && <LoginScreenOtp />} */}
      </div>
      <div className="flex flex-col items-center justify-center w-full bg-[#B3C7C5] h-screen basis-1/2">
        <Image
          src="/logo/Divine logo (B).png"
          alt="Image Description"
          height={520}
          width={612}
          sizes="100vw"
          className="w-40 mb-8"
          priority
        />
      </div>
    </div>
  );
};

export default LoginScreen;
