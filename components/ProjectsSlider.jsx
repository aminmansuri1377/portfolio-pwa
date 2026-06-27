"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectsSlider({ children }) {
  const sliderRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const speed = 0.5; // px per frame

    let animationFrame;

    const animate = () => {
      if (!isDragging) {
        slider.scrollLeft += speed;

        // reset when reaching halfway
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);

    const slider = sliderRef.current;

    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);

    slider.classList.add("cursor-grabbing");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    sliderRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const slider = sliderRef.current;

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;

    slider.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={sliderRef}
      className="overflow-x-auto cursor-grab scrollbar-hide select-none"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}
