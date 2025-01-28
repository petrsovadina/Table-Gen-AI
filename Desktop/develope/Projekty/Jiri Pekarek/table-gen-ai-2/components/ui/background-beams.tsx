"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const maskImage = `radial-gradient(40% 40% at ${mousePosition.x}px ${mousePosition.y}px, white 45%, transparent 100%)`;

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      />
      <div className="absolute inset-0 bg-black opacity-80" />
    </div>
  );
};
