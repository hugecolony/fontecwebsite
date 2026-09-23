"use client";

import { useEffect } from "react";

export default function ConfettiPopper() {
  useEffect(() => {
    let isRunning = true;
    let intervalTimer: NodeJS.Timeout;
    let stopTimer: NodeJS.Timeout;

    // Defer confetti initialization until 1.5s after initial page load
    const startTimer = setTimeout(() => {
      import("canvas-confetti").then((confettiModule) => {
        if (!isRunning) return;
        const confetti = confettiModule.default;
        const goldColors = ["#FFD700", "#DAA520", "#FFC107", "#FFF8DC", "#B8860B", "#F0E68C"];

        // Fire a small burst every 150ms instead of hammering the CPU every frame (60fps)
        intervalTimer = setInterval(() => {
          if (!isRunning) return;

          confetti({
            particleCount: 5,
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
        }, 150);

        // Stop the confetti after 3 seconds
        stopTimer = setTimeout(() => {
          isRunning = false;
          clearInterval(intervalTimer);
        }, 3000);
      }).catch(() => { });
    }, 1500);

    return () => {
      isRunning = false;
      clearTimeout(startTimer);
      clearInterval(intervalTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  return null;
}