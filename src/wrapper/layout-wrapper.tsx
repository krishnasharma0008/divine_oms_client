import Navbar from "@/components/common/navbar";
import Loader from "@/components/common/loader";
import React, { useState, useEffect } from "react";

export interface LayoutWrapperProps {
  children: React.ReactNode;
  loadingTime?: number;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  loadingTime = 2000,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), loadingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [loadingTime]);

  return (
    <div className="flex flex-col bg-slate-200 min-h-screen">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 transition-opacity">
          <Loader aria-live="polite" />
        </div>
      ) : (
        <>
          {/* Navbar: Sticky at the top */}
          <div className="sticky top-0 z-10 bg-white w-full">
            <Navbar />
          </div>

          {/* Main Content Area: Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Here the children will occupy the remaining space */}
            <main className="flex-1">{children}</main>
          </div>
        </>
      )}
    </div>
  );
};

export default LayoutWrapper;
