"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { NOTIFICATION_MESSAGES } from "@/config";
import LoaderContext from "@/context/loader-context";
import NotificationContext from "@/context/notification-context";
import LoginContext from "@/context/login-context";

const LoginScreenMobileInput: React.FC = () => {
  const { setEmailOrMobile } = useContext(LoginContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notifyErr } = useContext(NotificationContext);

  const [loginType, setLoginType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClickHandler = async () => {
    showLoader();
    setIsLoading(true); // Set loading state
    try {
      // const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      //   loginType
      // );
      // const isPhoneNumber = /^\d+$/.test(loginType) && loginType.length === 10;

      // if (isEmail || isPhoneNumber) {
      setEmailOrMobile(loginType);

      // Uncomment and implement the sendOtpToUser function
      // await sendOtpToUser(loginType);

      console.log("Navigating to OTP verification step");
      router.push("/login/verify");
      // } else {
      //   notifyErr("Invalid E-mail or Mobile Number");
      // }
    } catch (err) {
      console.log("LoginScreenMobile", err);
      notifyErr(NOTIFICATION_MESSAGES.SOMETHING_WRONG);
    } finally {
      setIsLoading(false); // Reset loading state
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex-grow w-full flex flex-col items-center p-6">
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="font-[Nunito Sans] text-[36px] leading-9 text-[#0C1421]">
            Welcome Back 👋
          </h2>
          <p className="mt-5 text-base text-[#525252] ">
            See what is going on with your business
          </p>
        </div>
        <div className="mt-10 w-96">
          <label
            htmlFor="loginType"
            className="text-gray-800 text-sm mb-2 block"
          >
            E-Mail / Mobile Number
          </label>
          <div className="relative flex items-center">
            <input
              id="loginType"
              type="text"
              className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              disabled={isLoading} // Disable input when loading
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-4 h-4 absolute right-4"
              viewBox="0 0 24 24"
            >
              <circle cx="10" cy="7" r="6"></circle>
              <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"></path>
            </svg>
          </div>
        </div>
        <div className="!mt-8 w-96">
          <button
            type="button"
            className={`w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-black focus:outline-none ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onClickHandler}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>
          <Image
            src="/logo/Or.png"
            alt=""
            height={520}
            width={612}
            sizes="100vw"
            className="w-full my-8"
            priority
          />
        </div>
        <div className="text-base bg-[#F3F9FA] font-normal leading-4 tracking-normal text-center p-4 rounded-md">
          <p className="text-gray-500">
            Not Registered Yet? Please Contact{" "}
            <strong className="pinter text-violet-700">+91 9877654333</strong>
          </p>
        </div>
      </div>
      <div className="mt-6 text-center h-10 w-full">
        <p>If you have any queries, please email us at.</p>
        <p>
          customerservice@divinesolitaires.com / helpdesk@divinesolitaires.com
        </p>
      </div>
      <div className="mt-6 text-center h-10 w-full">
        <p>© 2024 ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default LoginScreenMobileInput;
