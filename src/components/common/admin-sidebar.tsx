import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

interface SidebarNavItem {
  section: string;
  link?: string;
  icon: string;
  submenu?: SidebarNavItem[];
}

const sidebarNav: SidebarNavItem[] = [
  { section: "Dashboard", link: "/admin", icon: "mdi:home" },
  // {
  //   section: "Settings",
  //   icon: "mdi:cog",
  //   submenu: [
  //     { section: "Profile", link: "/admin/order", icon: "mdi:account" },
  //     { section: "Security", link: "/settings/security", icon: "mdi:lock" },
  //   ],
  // },
  { section: "Order List", link: "/admin/order", icon: "mdi:cog" },
];

const AdminSidebar: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleSubMenu = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <div className="bg-gray-100 h-screen transition-all duration-300 w-[235px] fixed z-20">
      <div className="flex justify-center items-center h-16 border-b border-gray-300 pl-4 py-4">
        <Link href="/">
          <Image
            src="/logo/old_logo.png"
            alt="Company Logo"
            width={120}
            height={60}
            className="h-auto w-auto max-h-[64px] object-contain"
          />
        </Link>
      </div>

      <nav className="mt-4">
        {sidebarNav.map((nav, index) => (
          <div key={index}>
            {/* Check if the item has a submenu or not */}
            {!nav.submenu ? (
              // If there's no submenu, render a direct Link
              <Link
                href={nav.link!}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-200 transition-colors text-gray-600"
              >
                <Icon icon={nav.icon} className="text-xl flex-shrink-0" />
                <span className="ml-3 font-medium">{nav.section}</span>
              </Link>
            ) : (
              // If there's a submenu, render the menu with the toggle logic
              <div>
                <div
                  onClick={() => toggleSubMenu(index)}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 transition-colors ${
                    expandedIndex === index ? "bg-gray-300" : ""
                  }`}
                  aria-expanded={expandedIndex === index ? "true" : "false"}
                >
                  <Icon
                    icon={nav.icon}
                    className="text-gray-600 text-xl flex-shrink-0"
                  />
                  <span className="ml-3 text-gray-700 font-medium">
                    {nav.section}
                  </span>
                  <Icon
                    icon="mdi:chevron-right"
                    className={`ml-auto text-gray-600 transition-transform ${
                      expandedIndex === index ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {/* Submenu rendering */}
                <div
                  className={`pl-8 transition-all duration-300 overflow-hidden ${
                    expandedIndex === index ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  {nav.submenu.map((subNav, subIndex) => (
                    <Link
                      href={subNav.link!}
                      key={subIndex}
                      className="block p-2 text-gray-600 hover:text-gray-800"
                    >
                      {subNav.section}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
