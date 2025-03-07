import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useCallback,
} from "react";
import {
  getToken,
  setToken,
  deleteToken,
  setUser,
  deleteUser,
  setUserRole,
  deleteUserRole,
  getCartCount,
  setCartCount,
  deleteCartCount,
} from "@/local-storage";
import { loginPasswordApi } from "@/api";

type TContext = {
  isLogin: boolean;
  emailOrMobile: string | null;
  isOtpVerified: boolean;
  setEmailOrMobile: (value: string) => void;
  verifyOtp: (username: string, otp: string) => Promise<boolean>;
  toggleLogin: () => void;
  isCartCount: number;
  updateCartCount: (count: number) => void;
  setIsCartCount: React.Dispatch<React.SetStateAction<number>>; // Added type for setIsCartCount
};

const LoginContext = createContext<TContext>({
  isLogin: false,
  emailOrMobile: null,
  isOtpVerified: false,
  setEmailOrMobile: () => {},
  verifyOtp: async () => false,
  toggleLogin: () => {},
  isCartCount: 0,
  updateCartCount: () => {},
  setIsCartCount: () => {}, // Default value for setIsCartCount
});

export const LoginContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [emailOrMobile, setEmailOrMobileState] = useState<string | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isCartCount, setIsCartCount] = useState<number>(
    getCartCount() || 0 // Initialize with localStorage value or 0
  );

  const validateToken = useCallback(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        if (payload.exp * 1000 > Date.now()) {
          setIsLogin(true);
          return true;
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    toggleLogin(); // Clear data if token is invalid
    return false;
  }, []);

  const verifyOtp = useCallback(
    async (username: string, otp: string): Promise<boolean> => {
      try {
        const res = await loginPasswordApi(username, otp);
        if (res?.data?.token) {
          setIsOtpVerified(true);
          setIsLogin(true);
          setToken(res.data.token);
          setUser(res.data.dpname);
          setUserRole(res.data.designation);
          setIsCartCount(Number(res.data.cartcount)); // Update cart count
          setCartCount(res.data.cartcount.toString()); // Store in localStorage
          return true;
        }
        return false;
      } catch (error) {
        console.error("OTP verification failed:", error);
        return false;
      }
    },
    []
  );

  const toggleLogin = useCallback(() => {
    deleteToken();
    deleteUser();
    deleteUserRole();
    setIsLogin(false);
    setIsOtpVerified(false);
    deleteCartCount();
    setEmailOrMobileState(null);
    localStorage.removeItem("customer-order-storage");
    localStorage.removeItem("customer-storage");
    localStorage.removeItem("custtype");
  }, []);

  const updateCartCount = useCallback((count: number) => {
    setCartCount(count.toString());
    setIsCartCount(count); // Update state
  }, []);

  useEffect(() => {
    validateToken();
    const initialCartCount = getCartCount();
    setIsCartCount(initialCartCount || 0); // Initialize cart count on mount
  }, [validateToken]);

  // Synchronize cart count with localStorage on every change
  useEffect(() => {
    setCartCount(isCartCount.toString());
  }, [isCartCount]); // This ensures localStorage is updated whenever the state changes

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        emailOrMobile,
        isOtpVerified,
        setEmailOrMobile: setEmailOrMobileState,
        verifyOtp,
        toggleLogin,
        isCartCount,
        updateCartCount,
        setIsCartCount, // Pass setIsCartCount in the provider value
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
