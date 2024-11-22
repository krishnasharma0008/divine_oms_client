"use client"; // Client-side component

import "./globals.css"; // Global CSS
import { ThemeProvider } from "@material-tailwind/react";
import { ReactNode, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import LoaderContext from "@/context/loader-context";
import { LayoutWrapper, NotificationWrapper, LoaderWrapper } from "@/wrapper";
import "react-datepicker/dist/react-datepicker.css";
import AuthLayout from "@/wrapper/auth-layout";
import LoginContext, { LoginContextProvider } from "@/context/login-context";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { isLogin } = useContext(LoginContext);
  //const [isClient, setIsClient] = useState(false);

  // Handle loader visibility during route changes
  useEffect(() => {
    showLoader();
    const handleRouteComplete = () => {
      hideLoader();
      console.log("Route change completed, hiding loader");
    };
    const timeoutId = setTimeout(handleRouteComplete, 500);

    return () => {
      clearTimeout(timeoutId);
      hideLoader();
    };

    console.log("pathname from Rootlayout ", pathname);
  }, [pathname, showLoader, hideLoader]);

  // Check if the current page is the login page
  const isLoginPage = pathname.startsWith("/login");

  return (
    <html lang="en">
      <body>
        {/* Wrapping the application with LoginContextProvider */}
        <LoginContextProvider>
          <NotificationWrapper>
            {/* If on the login page, render children directly */}
            {isLoginPage && !isLogin ? (
              children
            ) : (
              // For other pages, wrap with AuthLayout and other wrappers
              <AuthLayout>
                <ThemeProvider>
                  <LoaderWrapper>
                    <LayoutWrapper>{children}</LayoutWrapper>
                  </LoaderWrapper>
                </ThemeProvider>
              </AuthLayout>
            )}
          </NotificationWrapper>
        </LoginContextProvider>
      </body>
    </html>
  );
}
