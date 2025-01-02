import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken, getToken } from "@/local-storage";

const AuthLayout: React.FC<{ children: ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin = false,
}) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const isTokenValid = (token: string): boolean => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);

      if (requireAdmin && jsonPayload.designation !== "Admin") {
        return false;
      }

      return jsonPayload.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const token = requireAdmin ? getAdminToken() : getToken();
      if (token && isTokenValid(token.replace("Bearer ", ""))) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
      }
    };

    // Run on client-side only
    if (typeof window !== "undefined") {
      checkAuthentication();
    }
  }, [requireAdmin]);

  useEffect(() => {
    if (authState === "unauthenticated") {
      router.push(requireAdmin ? "/admin/login" : "/login");
    }
  }, [authState, router, requireAdmin]);

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
