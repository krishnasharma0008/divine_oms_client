// app/layout-wrapper.tsx
import Navbar from "@/components/common/navbar";
import React, { useState, useEffect } from "react";
// import Navbar from "@/components/common/navbar";
// import Footer from "@/components/common/footer";
// import Loader from "@/components/common/loader";

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-200 flex h-screen">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <p>Loading...</p>
        </div>
      )}
      <div className="flex h-full w-full flex-col">
        <Navbar />
        <div className="overflow-hidden">
          <main className="h-[90vh] overflow-auto px-4 py-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
