"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    author: string;
    role: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setStart(true);
    }
  }

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return "20s";
      case "normal":
        return "40s";
      case "slow":
        return "80s";
      default:
        return "40s";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          "--animation-duration": getSpeed(),
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-neutral-700 bg-neutral-800 px-8 py-6"
          >
            <blockquote>
              <p className="text-sm leading-6 text-neutral-300">
                {item.quote}
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="text-sm font-semibold leading-6 text-white">
                {item.author}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-400">
                {item.role}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
