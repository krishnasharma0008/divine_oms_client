"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const [pathnames, setPathnames] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter((x) => x);
    setPathnames(segments);
  }, [pathname]);

  const formatTitle = (title: string) => {
    return title
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  if (pathnames.length === 0) return null;

  // Only show last 3 segments for mobile
  const displayedPath = pathnames.length > 3 ? ["...", ...pathnames.slice(-2)] : pathnames;

  return (
    <nav className="breadcrumb text-sm px-2 py-1 sm:text-base" aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
        <li>
          <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <span className="mx-1">/</span>
        </li>
        {displayedPath.map((value, index) => {
          const isLast = index === displayedPath.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <Link
                  href={`/${pathnames.slice(0, index + 1).join("/")}`}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {value === "..." ? "..." : formatTitle(value)}
                </Link>
              ) : (
                <span className="font-semibold">{formatTitle(value)}</span>
              )}
              {!isLast && <span className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
