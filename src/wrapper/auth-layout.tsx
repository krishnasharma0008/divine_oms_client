// app/auth-layout.tsx
import React, { ReactNode, useEffect } from "react";
//import LoginContext from "@/context/login-context";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/local-storage";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  //const { isLogin } = useContext(LoginContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    //console.log("Auth!isLogin", isLogin);
    if (!getToken() && pathname !== "/login") {
      console.log("Redirecting to /login from Auth 1");
      router.push("/login");
    }
  }, [pathname, router]);

  // Display a loading message while checking the login status
  if (!getToken() && pathname !== "/login") {
    console.log("Redirecting to /login from Auth 2");
    return <p>Loading...</p>;
  } else {
    return <>{children}</>; // Render children if logged in or on the login page
  }
};

export default AuthLayout;
