"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiPopper() {
  useEffect(() => {
    let animationFrameId: number;
    let isRunning = true;

    // Define luxurious gold color palette
    const goldColors = ["#FFD700", "#DAA520", "#FFC107", "#FFF8DC", "#B8860B", "#F0E68C"];

    const frame = () => {
      if (!isRunning) return;

      confetti({
        particleCount: 2,
        angle: 90,
        spread: 360,
        startVelocity: 15,
        origin: {
          x: Math.random(),
          y: -0.1,
        },
        colors: goldColors,
        shapes: ["square", "circle"],
        scalar: 0.8,
        gravity: 0.8,
        drift: Math.random() - 0.5,
        ticks: 300,
      });

      animationFrameId = requestAnimationFrame(frame);
    };

    // Start the continuous rain loop
    frame();

    // Automatically stop the confetti generator after 5 seconds (5000 milliseconds)
    const timer = setTimeout(() => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    }, 3000);

    // Cleanup on unmount
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, []);

  return null;
}