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
      const sections = ["conf", "journal", "home", "about", "events", "join"];
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if(pathname){
      setActiveSection(pathname.slice(1) || "conf");
    }
  }, [pathname]);

  const navItems = [
    { name: "Conference", href: "#conf" },
    { name: "Journal", href: "#journal" },
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Join Us", href: "#join" },
  ];

  if (isMobile) {
    return null; // Don't render the header on mobile devices
  }

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-100 bg-opacity-90 backdrop-blur-md z-50 rounded-2xl shadow-lg w-[90%] max-w-[900px]">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-gray-700 hover:text-gray-900 transition duration-300 text-center text-base sm:text-lg font-semibold px-2 sm:px-4 ${
              activeSection === item.href.slice(1) ? "text-gray-900" : ""
            }`}
          >
            <span className="relative inline-block">
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gray-700 transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </span>
          </Link>
        ))}
        <div className="flex justify-center px-2 sm:px-4">
          <Image
            src="/hmsa2.png"
            alt="HMSA Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
