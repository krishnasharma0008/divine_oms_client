import Loader from "@/components/common/loader";
import React, { useState, useEffect, useContext } from "react";
import AdminSidebar from "@/components/common/admin-sidebar";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import LoginContext from "@/context/login-context";
import { getUser } from "@/local-storage";
//import Image from "next/image";

export interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  loadingTime?: number;
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({
  children,
  loadingTime = 2000,
}) => {
  const router = useRouter();
  const { toggleLogin } = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  useEffect(() => {
    setIsClient(true); // Set to true once the component has mounted on the client
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), loadingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [loadingTime]);

  const logout = () => {
    toggleLogin(); // Clear login context
    router.push("/admin/login"); // Navigate to admin login page
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement; // Assert the target as HTMLElement
      if (target && !target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!isClient) {
    return null; // Ensure rendering happens only on the client-side
  }

  return (
    <div className="flex flex-col bg-[#F5F7F8] h-screen">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 transition-opacity">
          <Loader aria-live="polite" />
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Fixed Sidebar */}
          <aside className="w-64 bg-gray-100 text-white pb-5 pl-5 fixed inset-y-0 left-0 top-0">
            <AdminSidebar />
          </aside>

          {/* Main content area  */}
          <div className="flex-1 flex flex-col ml-64">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-gray-100 text-gray-700 p-4 z-10 flex items-center justify-between shadow">
              <h1 className="text-lg font-bold">Dashboard</h1>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {/* <Image
      src="/jewellery/NoImageBig.jpg"
      alt="User Avatar"
      className="w-10 h-10 rounded-full"
      width={40}
      height={40}
    /> */}
                  <span className="hidden sm:block">{getUser()}</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`text-xl transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-700 shadow-lg rounded-lg w-48">
                    <ul>
                      {/* <li>
          <a
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Settings
          </a>
        </li> */}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto p-5 bg-gray-100">
              {children}
            </main>

            {/* Sticky Footer */}
            {/* <footer className="py-4 bg-indigo-500 text-center text-white">
              Tailwind Sticky Footer
            </footer> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayoutWrapper;
