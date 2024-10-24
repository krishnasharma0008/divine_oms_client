"use client"; // Client-side component

import "./globals.css"; // Global CSS
import { ThemeProvider } from "@material-tailwind/react";
import { ReactNode, useEffect, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoaderContext from "@/context/loader-context";
import { LayoutWrapper, NotificationWrapper, LoaderWrapper } from "@/wrapper";
import "react-datepicker/dist/react-datepicker.css";
import AuthLayout from "@/wrapper/auth-layout";
import { LoginContextProvider } from "@/context/login-context";
import { getToken } from "@/local-storage";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [isClient, setIsClient] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);

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

    const tokenFromStorage = getToken();
    console.log("Token retrieved at startup:", tokenFromStorage);
    setTokenState(tokenFromStorage);

    // Redirect if no token is found and not on the login page
    if (!tokenFromStorage && !pathname.startsWith("/login")) {
      console.log("No token found, redirecting to login");
      router.replace("/login");
    }
  }, [pathname, router]);

  const isLoginPage = pathname.startsWith("/login");
  const showAuthLayout = !isLoginPage && !!token;

  if (!isClient) {
    return null; // Optionally show a loading spinner here
  }

  return (
    <html lang="en">
      <body className="text-sm">
        <LoginContextProvider>
          <NotificationWrapper>
            {showAuthLayout ? (
              <AuthLayout>
                <ThemeProvider>
                  <LoaderWrapper>
                    <LayoutWrapper>{children}</LayoutWrapper>
                  </LoaderWrapper>
                </ThemeProvider>
              </AuthLayout>
            ) : (
              children // Render login page or if not logged in
            )}
          </NotificationWrapper>
        </LoginContextProvider>
      </body>
    </html>
  );
}
