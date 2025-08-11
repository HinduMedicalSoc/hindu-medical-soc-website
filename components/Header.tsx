"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // This matches Tailwind's 'md' breakpoint
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "events", "join"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    // Only add scroll listener on home page
    if (pathname === '/') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname) {
      // Set active section based on current path
      if (pathname === '/') {
        setActiveSection("home");
      } else {
        setActiveSection(pathname.slice(1));
      }
    }
  }, [pathname]);

  const navItemsDesktop = [
    { name: "Home", href: "/" }, // Changed to route for proper navigation
    { name: "About Us", href: "/#about" },
    { name: "Events", href: "/#events" },
    { name: "Conference", href: "/conference" },
    { name: "Join Us", href: "/#join" },
  ];

  const navItemsMobile = [
    { name: "Home", href: "/" }, // Changed to route for proper navigation
    { name: "About Us", href: "/#about" },
    { name: "Join Us", href: "/#join" },
    { name: "Conference", href: "/conference" },
    { name: "Events", href: "/#events" },
  ];

  const navItems = isMobile ? navItemsMobile : navItemsDesktop;

  // Helper function to determine active state for different link types
  const getActiveState = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href.startsWith("/#")) {
      const section = href.slice(2);
      return activeSection === section;
    }
    if (href.startsWith("/") && !href.includes("#")) {
      return pathname === href;
    }
    return false;
  };

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-100 bg-opacity-90 backdrop-blur-md z-50 rounded-2xl shadow-lg w-[90%] max-w-[900px]">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-gray-700 hover:text-gray-900 transition duration-300 text-center text-base sm:text-lg font-semibold px-2 sm:px-4 ${
              getActiveState(item.href) ? "text-gray-900" : ""
            }`}
            scroll={item.href.includes("#")} // Enable smooth scroll for anchor links
          >
            <span className="relative inline-block">
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gray-700 transition-all duration-300 ${
                  getActiveState(item.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </span>
          </Link>
        ))}
        <div className="flex justify-center px-2 sm:px-4">
          <Link href="/">
            <Image
              src="/hmsa2.png"
              alt="HMSA Logo"
              width={60}
              height={60}
              className="rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
