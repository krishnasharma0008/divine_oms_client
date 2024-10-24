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
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol className="breadcrumbList">
        <li className="breadcrumbItem">
          <Link href="/">Home</Link>
          {pathnames.length > 0 && (
            <span className="breadcrumbSeparator">{" / "}</span>
          )}
        </li>
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={routeTo} className="breadcrumbItem">
              {!isLast ? (
                <Link href={routeTo}>{formatTitle(value)}</Link>
              ) : (
                <span>{formatTitle(value)}</span>
              )}
              {!isLast && <span className="breadcrumbSeparator">{" / "}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
