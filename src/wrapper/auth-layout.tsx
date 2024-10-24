// app/auth-layout.tsx
import React, { useContext, ReactNode } from "react";
import LoginContext from "@/context/login-context";
import { useRouter, usePathname } from "next/navigation";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLogin } = useContext(LoginContext);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    console.log("isLogin : ", !isLogin);
    if (!isLogin && pathname !== "/login") {
      console.log("Redirecting to /login");
      router.push("/login");
    }
  }, [isLogin, pathname, router]);

  // Display a loading message while checking the login status
  if (!isLogin && pathname !== "/login") {
    return <p>Loading...</p>;
  }

  return <>{children}</>; // Render children if logged in or on the login page
};

export default AuthLayout;
