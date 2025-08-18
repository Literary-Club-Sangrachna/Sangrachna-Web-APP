"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  src: string;
  alt: string;
}

interface PhotoCarouselProps {
  images: CarouselImage[];
  interval?: number;
  duration?: number;
}

export default function PhotoCarousel({
  images,
  interval = 4000,
  duration = 0.6,
}: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    if (isAnimating || images.length < 2) return;
    setDirection(1);
    setIsAnimating(true);
  };

  const prev = () => {
    if (isAnimating || images.length < 2) return;
    setDirection(-1);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => next(), interval);
    return () => clearInterval(id);
  }, [current, interval, images.length]);

  const incomingIndex = (current + direction + images.length) % images.length;

  const handleIncomingComplete = () => {
    if (!isAnimating) return;
    setCurrent(incomingIndex);
    setIsAnimating(false);
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (dx > 50) next();
    else if (dx < -50) prev();
    touchStartX.current = null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-lg bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ height: "400px" }}
      >
        <div className="relative w-full h-full">
          {/* Current Slide */}
          <motion.img
            key={`current-${current}`}
            src={images[current].src}
            alt={images[current].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ x: "0%" }}
            animate={{
              x: isAnimating ? (direction === 1 ? "-100%" : "100%") : "0%",
            }}
            transition={{
              duration,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          />

          {/* Incoming Slide (Smooth Zoom + Fade + Slide) */}
          {isAnimating && (
            <motion.img
              key={`incoming-${incomingIndex}-${direction}`}
              src={images[incomingIndex].src}
              alt={images[incomingIndex].alt}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{
                x: direction === 1 ? "100%" : "-100%",
                scale: 1,
                opacity: 0,
              }}
              animate={{
                x: "0%",
                scale: 1.03,
                opacity: 1,
              }}
              transition={{
                duration,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              onAnimationComplete={handleIncomingComplete}
            />
          )}
        </div>

        {/* Prev/Next Buttons */}
        <button
          onClick={prev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2
                     bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2
                     bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
