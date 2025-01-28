"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-4 inset-x-0 max-w-2xl mx-auto z-50",
        className
      )}
    >
      <motion.div
        layout
        className={cn(
          "flex items-center justify-center space-x-4 rounded-full px-4 py-2 backdrop-blur-md",
          isScrolled ? "bg-neutral-950/70" : "bg-transparent"
        )}
      >
        {navItems.map((item, index) => (
          <Link
            key={item.link}
            href={item.link}
            className={cn(
              "relative px-4 py-2 text-sm text-neutral-300 transition-colors hover:text-neutral-100"
            )}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
};
