"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { NOTIFICATION_MESSAGES } from "@/config";
import LoaderContext from "@/context/loader-context";
import NotificationContext from "@/context/notification-context";
import LoginContext from "@/context/login-context";

const LoginScreenMobileInput: React.FC = () => {
  const router = useRouter();

  const { setEmailOrMobile, verifyOtp, isOtpVerified } =
    useContext(LoginContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notifyErr, notify } = useContext(NotificationContext);

  const [loginType, setLoginType] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [loginTypeError, setLoginTypeError] = useState(false); // To track error for loginType
  const [passwordError, setPasswordError] = useState(false); // To track error for password

  useEffect(() => {
    console.log("Updated isOtpVerified:", isOtpVerified);
  }, [isOtpVerified]);

  // const Resend = async () => {
  //   try {
  //     showLoader();
  //     setIsLoading(true);
  //     //await loginGetOTP(mobileNumber);
  //     //window.location.reload();
  //   } catch (err) {
  //     console.log("LoginScreenOtp", err);
  //     notifyErr(NOTIFICATION_MESSAGES.SOMETHING_WRONG);
  //     setIsLoading(false);
  //     hideLoader();
  //   }
  // };

  const onClickHandler = async () => {
    showLoader();
    setIsLoading(true); // Set loading state
    try {
      // const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      //   loginType
      // );
      // const isValidPhoneNumber = /^\d{10}$/.test(loginType);

      // if (isValidEmail || isValidPhoneNumber) {
      // if (password.trim().length < 6) {
      //   notifyErr("Password must be at least 6 characters long");
      //   return;
      // }
      //console.log(loginType);

      // Check if the email/phone number or password is empty
      if (!loginType.trim()) {
        setLoginTypeError(true); // Mark loginType as error
        notifyErr("Username cannot be empty");
        setIsLoading(false);
        hideLoader();
        return;
      } else {
        setLoginTypeError(false); // Reset error state for loginType
      }

      if (!password.trim()) {
        setPasswordError(true); // Mark password as error
        notifyErr("Password cannot be empty");
        setIsLoading(false);
        hideLoader();
        return;
      } else {
        setPasswordError(false); // Reset error state for password
      }

      setEmailOrMobile(loginType);
      console.log("2");
      const isValid = await verifyOtp(loginType, password); // Pass only the OTP
      if (isValid) {
        notify(NOTIFICATION_MESSAGES.LOGIN_SUCCESS);
        router.push("/"); // Redirect after successful OTP verification
      } else {
        notifyErr(NOTIFICATION_MESSAGES.LOGIN_FAIL);
      }
      console.log("Navigating to dashboard...");
      //router.push("/");
      // } else {
      //   notifyErr("Invalid Email or Mobile Number");
      // }
    } catch (err) {
      console.error("LoginScreenMobileInput - Error during login:", err);
      notifyErr(NOTIFICATION_MESSAGES.SOMETHING_WRONG);
    } finally {
      setIsLoading(false); // Reset loading state
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex-grow w-full flex flex-col items-center px-4 py-6">
        <div className="w-full flex flex-col items-center justify-center mb-6">
          <p className="text-base text-[#525252] mb-4 text-center">
            Divine Solitaires Order Management System
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label
            htmlFor="loginType"
            className="text-gray-800 text-sm mb-2 block"
          >
            {/* Email/Mobile Number */}User Name
          </label>
          <div className="relative flex items-center mb-4">
            <input
              id="loginType"
              type="text"
              className={`w-full text-gray-800 text-sm border px-4 py-3 rounded-md outline-blue-600 ${
                loginTypeError ? "border-red-500" : "border-gray-300"
              }`}
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              disabled={isLoading} // Disable input when loading
            />
          </div>
        </div>
        <div className="w-full max-w-sm mt-2">
          <input
            id="password"
            type="password"
            className={`w-full text-gray-800 text-sm border px-4 py-3 rounded-md outline-blue-600 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} // Disable input when loading
          />
          {/* <div className="text-right mb-4">
            <button
              type="button"
              className="text-blue-600 text-sm underline focus:outline-none"
              onClick={Resend}
              disabled={isLoading} // Disable resend while loading
              aria-label="Resend OTP"
            >
              Resend OTP
            </button>
          </div> */}
        </div>
        <div className="w-full max-w-sm mt-6">
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
            className="w-full my-6"
            priority
          />
        </div>
        {/* <div className="text-base bg-[#F3F9FA] font-normal leading-4 tracking-normal text-center p-3 rounded-md mt-6">
          <p className="text-gray-500">
            Not Registered Yet? Please Contact{" "}
            <strong className="pinter text-violet-700">+91 9877654333</strong>
          </p>
        </div> */}
      </div>
      <div className="mt-4 text-center text-sm">
        <p>If you have any queries, please email us at:</p>
        <p>
          customerservice@divinesolitaires.com / helpdesk@divinesolitaires.com
        </p>
      </div>
      <div className="mt-4 text-center text-sm">
        <p>© 2024 ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default LoginScreenMobileInput;
