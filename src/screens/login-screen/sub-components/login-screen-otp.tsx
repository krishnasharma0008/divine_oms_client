import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

//import { loginGetOTP, loginVerifyOTP } from "@/api";
//import { loginPasswordApi } from "@/api";
//import { Button } from "@/components";
import { NOTIFICATION_MESSAGES } from "@/config";
import LoaderContext from "@/context/loader-context";
import NotificationContext from "@/context/notification-context";
import LoginContext from "@/context/login-context";
//import { deleteMobileNumber, getMobileNumber, setToken } from "@/local-storage";

const LoginScreenOtp: React.FC = () => {
  //const [otp, setOTP] = useState<string>("    ");
  // const [mobileNumber, setMobileNumber] = useState<string>("");
  // useEffect(() => {
  //   setMobileNumber(getMobileNumber() as string);
  // }, []);cartcount
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notifyErr, notify } = useContext(NotificationContext);
  const { verifyOtp, isOtpVerified } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);
  //for password only
  const [password, setPassword] = useState("");
  //const [otp, setOTP] = useState<string>(Array(4).fill("").join("")); // Set initial state to 4 empty characters
  //const refs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();

  const Resend = async () => {
    try {
      showLoader();
      setIsLoading(true);
      //await loginGetOTP(mobileNumber);
      //window.location.reload();
    } catch (err) {
      console.log("LoginScreenOtp", err);
      notifyErr(NOTIFICATION_MESSAGES.SOMETHING_WRONG);
      setIsLoading(false);
      hideLoader();
    }
  };

  const onClickHandler = async () => {
    showLoader();
    setIsLoading(true);
    try {
      // Call verifyOtp with only the OTP
      const isValid = await verifyOtp(password); // Pass only the OTP
      if (isValid) {
        notify(NOTIFICATION_MESSAGES.LOGIN_SUCCESS);
        router.push("/"); // Redirect after successful OTP verification
      } else {
        notifyErr(NOTIFICATION_MESSAGES.LOGIN_FAIL);
      }
    } catch (err) {
      console.error("Error during OTP verification:", err);
      notifyErr(NOTIFICATION_MESSAGES.LOGIN_FAIL);
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  };

  //uncomment for otp login
  // const otpInputChangeHandler =
  //   (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const chars = otp.split("");

  //     let value = e.target.value.replace(/\ /g, "");
  //     if (value.length > 1) {
  //       index = otp.replace(/\ /g, "").length;
  //       value = value[value.length - 1];
  //       refs.current[index]?.focus();
  //     }
  //     if (index <= 3) {
  //       chars[index] = value;
  //     }

  //     setOTP(chars.join(""));
  //   };

  // Log the isOtpVerified state whenever it changes
  useEffect(() => {
    console.log("Updated isOtpVerified:", isOtpVerified);
  }, [isOtpVerified]);

  return (
    <div className="w-full flex flex-col items-center p-6 py-12">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex flex-row justify-center items-center">
          <Image
            src="/logo/check-one.png"
            alt="Choose order"
            width={869}
            height={567}
            className="h-[48px] w-auto cursor-pointer py-1 mb-4"
            layout="intrinsic"
          />
        </div>
        <p className="mb-8 text-[32px] font-normal leading-8 tracking-normal text-center">
          Verification Code
        </p>
      </div>
      <div className="md:my-6 w-full flex flex-row justify-center items-center gap-x-2">
        {/* {otp.split("").map((digit, index) => (
          <input
            key={index}
            //ref={(ref) => (refs.current[index] = ref)}
            ref={(ref) => {
              refs.current[index] = ref; // Assign ref
            }}
            type="text"
            value={digit}
            onChange={otpInputChangeHandler(index)}
            maxLength={2}
            className="border border-black rounded-md py-2 px-4 text-base md:text-lg focus:outline-none focus:ring focus:ring-red-200 text-gray-800 !px-0"
            style={{ width: "2rem", textAlign: "center" }}
          />
        ))} */}
        <input
          id="password"
          type="text"
          className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading} // Disable input when loading
        />
      </div>
      <p className="mt-8 text-base md:text-lg font-normal leading-5 tracking-normal text-center">
        Not received yet{" "}
        <Link href="#" onClick={Resend} className="font-semibold">
          Resend
        </Link>
      </p>
      {/* <Button
        onClick={onClickHandler}
        themeType="dark"
        classes="!mt-12 py-3 text-lg font-normal leading-6"
      >
        Submit
      </Button> */}
      <div>
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

export default LoginScreenOtp;
