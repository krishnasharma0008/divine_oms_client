import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  //deleteToken,
  //getAdminToken,
  //deleteAdminToken,
} from "@/local-storage";

const AuthLayout: React.FC<{ children: ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false,
}) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  const isTokenValid = (token: string): boolean => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);

      // if (requireAdmin && jsonPayload.designation !== "Admin") {
      //   return false;
      // }

      return jsonPayload.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true); // Ensure this is done only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip authentication logic on SSR

    const checkAuthentication = () => {
      //const token = requireAdmin ? getAdminToken() : getToken();
      const token = getToken();
      console.log("token : ", token);
      if (token && isTokenValid(token.replace("Bearer ", ""))) {
        setAuthState("authenticated");
      } else {
        //requireAdmin ? deleteAdminToken() : deleteToken();
        setAuthState("unauthenticated");
      }
    };

    checkAuthentication();
  }, [isClient, requireAdmin]);

  useEffect(() => {
    console.log("authState: ", authState);
    if (authState === "unauthenticated") {
      router.push(requireAdmin ? "/admin/login" : "/login");
    }
  }, [authState, router, requireAdmin]);

  if (authState === "loading" || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
