// app/auth-layout.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/local-storage";

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State to handle loading

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = getToken(); // Retrieve token only on the client
      setToken(storedToken); // Update state
      setIsLoading(false); // Set loading to false after retrieval
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !token && pathname !== "/login") {
      console.log("Redirecting to /login from Auth");
      router.push("/login");
    }
  }, [isLoading, token, pathname, router]);

  if (isLoading) {
    return <p>Loading...</p>; // Show loading while checking for token
  }

  return <>{children}</>; // Render children if loaded and logged in
};

export default AuthLayout;
