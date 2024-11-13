// app/layout-wrapper.tsx
import Navbar from "@/components/common/navbar";
import Loader from "@/components/common/loader";
import React, { useState, useEffect } from "react";

export interface LayoutWrapperProps {
  children: React.ReactNode;
  loadingTime?: number; // Optional loading time prop
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  loadingTime = 2000,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling on both html and body
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Set loading timer
    const timer = setTimeout(() => {
      setLoading(false);
    }, loadingTime);

    return () => {
      clearTimeout(timer);
      // Re-enable scrolling on cleanup
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loadingTime]);

  return (
    <div className="bg-slate-200 flex h-screen overflow-hidden">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <Loader aria-live="polite" />
        </div>
      )}
      <div className="flex h-full w-full flex-col">
        {/* Set Navbar to sticky */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>
        <div className="flex-grow overflow-hidden">
          <main className="h-full px-4 py-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
