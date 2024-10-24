"use client"; // Client-side component

import "./globals.css"; // Global CSS
import { ThemeProvider } from "@material-tailwind/react";
import { ReactNode, useEffect, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import LoaderContext from "@/context/loader-context";
import { LayoutWrapper, NotificationWrapper, LoaderWrapper } from "@/wrapper";
import "react-datepicker/dist/react-datepicker.css";
import AuthLayout from "@/wrapper/auth-layout";
import { LoginContextProvider } from "@/context/login-context";
//import { getToken } from "@/local-storage";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  //const router = useRouter();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [isClient, setIsClient] = useState(false);

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
  }, [pathname, showLoader, hideLoader]);

  useEffect(() => {
    setIsClient(true); // Client-side only
  }, []);

  const isLoginPage = pathname.startsWith("/login");

  if (!isClient) {
    return null; // Optionally show a loading spinner here
  }

  return (
    <html lang="en">
      <body className="text-sm">
        <LoginContextProvider>
          <NotificationWrapper>
            {isLoginPage ? (
              children // Render login page if on the login page
            ) : (
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
