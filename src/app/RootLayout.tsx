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
//import AdminLayoutWrapper from "@/wrapper/admin-layout-wrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const pathname = usePathname();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Handle loader visibility during route changes
  useEffect(() => {
    setIsClient(true); // Set to true after initial render

    showLoader();

    // Simulate route change completion with a delay
    const timeoutId = setTimeout(() => {
      hideLoader();
      console.log("Route change completed, hiding loader");
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      hideLoader();
    };
  }, [pathname, showLoader, hideLoader]);

  // Check if the current page is the login page
  const isLoginPage = pathname.startsWith("/login");
  const isAdminLoginPage = pathname.startsWith("/admin/login");

  // Check if the current route is for an admin page
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isClient) {
    // Ensure client-side rendering before rendering the layout
    return null;
  }

  return (
    <html lang="en">
      <body>
        {/* Wrapping the application with LoginContextProvider */}
        <LoginContextProvider>
          <NotificationWrapper>
            {/* If on the login or admin login page, render children directly */}
            {isLoginPage || isAdminLoginPage ? (
              children
            ) : (
              // For non-login pages, wrap with appropriate layout based on user type
              <AuthLayout requireAdmin={isAdminRoute}>
                <ThemeProvider>
                  <LoaderWrapper>
                    {/* Render different layouts based on admin or normal user */}
                    {isAdminRoute ? (
                      // <AdminLayoutWrapper>{children}</AdminLayoutWrapper> // Admin layout
                      <></>
                    ) : (
                      <LayoutWrapper>{children}</LayoutWrapper> // Normal user layout
                    )}
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
