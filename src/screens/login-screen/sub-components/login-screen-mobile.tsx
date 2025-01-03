"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { NOTIFICATION_MESSAGES } from "@/config";
import LoaderContext from "@/context/loader-context";
import NotificationContext from "@/context/notification-context";
import LoginContext from "@/context/login-context";

const LoginScreenMobileInput: React.FC = () => {
  const router = useRouter();
  const { setEmailOrMobile, verifyOtp } = useContext(LoginContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notifyErr, notify } = useContext(NotificationContext);

  const [loginType, setLoginType] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginTypeError, setLoginTypeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onClickHandler = async () => {
    showLoader();
    setIsLoading(true);
    try {
      if (!loginType.trim()) {
        setLoginTypeError(true);
        notifyErr("Username cannot be empty");
        setIsLoading(false);
        hideLoader();
        return;
      } else {
        setLoginTypeError(false);
      }

      if (!password.trim()) {
        setPasswordError(true);
        notifyErr("Password cannot be empty");
        setIsLoading(false);
        hideLoader();
        return;
      } else {
        setPasswordError(false);
      }

      setEmailOrMobile(loginType);
      const isValid = await verifyOtp(loginType, password);
      if (isValid) {
        notify(NOTIFICATION_MESSAGES.LOGIN_SUCCESS);
        router.push("/");
      } else {
        notifyErr(NOTIFICATION_MESSAGES.LOGIN_FAIL);
      }
    } catch (err) {
      console.error("Error during login:", err);
      notifyErr(NOTIFICATION_MESSAGES.SOMETHING_WRONG);
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <header className="bg-white w-full text-black text-left text-3xl">
            Login
          </header>
          <div className="mt-4 mb-8 text-left">
            <p className="text-sm text-[#525252]">
              Divine Solitaires Order Management System
            </p>
          </div>
          <label
            htmlFor="loginType"
            className="text-gray-800 text-sm mb-2 block"
          >
            Email/Mobile Number
          </label>
          <input
            id="loginType"
            type="text"
            placeholder="Email/Mobile Number"
            className={`w-full text-gray-800 text-sm border px-4 py-3 rounded-md outline-blue-600 ${
              loginTypeError ? "border-red-500" : "border-gray-300"
            }`}
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
            disabled={isLoading}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`w-full text-gray-800 text-sm border px-4 py-3 rounded-md mt-4 outline-blue-600 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className={`mt-12 w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-black mt-6 focus:outline-none ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onClickHandler}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>
          <Image
            src="/logo/Or.png"
            alt=""
            height={520}
            width={612}
            sizes="100vw"
            className="w-full my-4"
            priority
          />
          <div className="w-full text-base bg-[#F3F9FA] font-normal leading-4 tracking-normal text-center p-3 rounded-md">
            <p className="text-gray-500 whitespace-nowrap">
              Not Registered Yet? Please Contact{" "}
              <strong className="text-blue-700">+91 9518373847</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-sm">
        <p>If you have any queries, please email us at</p>
        <p className="text-blue-700">helpdesk@divinesolitaires.com</p>
        <p className="mt-2">© 2024 ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

export default LoginScreenMobileInput;
