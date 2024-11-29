import React, { useEffect, useState, createContext, ReactNode, useCallback } from "react";
import {
  getToken,
  setToken,
  deleteToken,
  setMobileNumber,
  setUser,
  //getUser,
  deleteUser,
  setUserRole,
  //getUserRole,
  deleteUserRole,
} from "@/local-storage";
import { loginPasswordApi } from "@/api";

// Example function to simulate sending OTP (replace with actual API call)
const sendOtpToUser = async (emailOrMobile: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (emailOrMobile) {
        console.log(`OTP sent to: ${emailOrMobile}`);
        resolve();
      } else {
        reject(new Error("Failed to send OTP"));
      }
    }, 1000);
  });
};

type TContext = {
  isLogin: boolean;
  emailOrMobile: string | null;
  isOtpVerified: boolean;
  setEmailOrMobile: (value: string) => void;
  verifyOtp: (otp: string) => Promise<boolean>;
  toggleLogin: () => void;
  isCartCount: number;
  updateCartCount: (count: number) => void; // New function to update the cart count
};

const LoginContext = createContext<TContext>({
  isLogin: false,
  emailOrMobile: null,
  isOtpVerified: false,
  setEmailOrMobile: () => {},
  verifyOtp: async () => false,
  toggleLogin: () => {},
  isCartCount: 0,
  updateCartCount: () => {}, // Default empty function
});

export const LoginContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [emailOrMobile, setEmailOrMobileState] = useState<string | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isCartCount, setCartCount] = useState<number>(0);

  const handleSetEmailOrMobile = async (value: string) => {
    setEmailOrMobileState(value);
    setMobileNumber(value);
    try {
      await sendOtpToUser(value);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      const res = await loginPasswordApi(emailOrMobile as string, otp);
      if (res && res.data && res.data.token) {
        setIsOtpVerified(true);
        setIsLogin(true);
        setToken(res.data.token); // Ensure you're getting the token from the correct path
        setUser(res.data.dpname);
        setUserRole(res.data.role);
        setCartCount(res.data.cartcount || 0);
        return true; // Return true for a successful verification
      }
      return false; // Return false if no valid response
    } catch (error) {
      console.error("OTP verification failed:", error);
      return false; // Handle error and return false
    }
  };

  const toggleLogin = () => {
    if (isLogin) {
      deleteToken(); // Clear the token from local storage
      setIsLogin(false);
      setCartCount(0); // Reset cart count on logout
      setIsOtpVerified(false);
      setEmailOrMobileState(null);
      deleteUser();
      deleteUserRole();
    }
  };

  // Update cart count globally
  const updateCartCount = useCallback((count: number) => {
    setCartCount(count);
    // Optionally, persist the count to localStorage
    localStorage.setItem("cartCount", count.toString());
  }, []);


  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLogin(true); // Token exists, so set the user as logged in
      const storedCartCount = localStorage.getItem("cartCount");
      if (storedCartCount) {
        setCartCount(Number(storedCartCount));
      }
    } else {
      setIsLogin(false);
    }
  }, []);

  // useEffect(() => {
  //   const token = getToken();
  //   //console.log("Token retrieved at startup:", token); // Log token for debugging
  //   console.log("1isLogin", isLogin);
  //   setIsLogin(!!token); // Set isLogin based on token presence
  //   console.log("12isLogin", !!isLogin);
  // }, [isLogin]);

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        emailOrMobile,
        isOtpVerified,
        setEmailOrMobile: handleSetEmailOrMobile,
        verifyOtp,
        toggleLogin,
        isCartCount,
        updateCartCount, // Provide the update function
      }}
    >
      {children}
      {/* {isLogin ? <Dashboard /> : <LoginScreen />} */}
    </LoginContext.Provider>
  );
};

export default LoginContext;
