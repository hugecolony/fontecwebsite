'use client'
import React from 'react';

export function ScrollingPromotion() {
  const promoText = "⚡ FREE RETURNS & EXCHANGES — THOUSANDS OF 5-STAR REVIEWS — OPEN PARCEL BEFORE PAYMENT — SHOP PREMIUM FONTEC MOBILE ACCESSORIES TODAY! 🚀";

  return (
    <div className="relative w-full bg-blue-700 text-white py-4 overflow-hidden shadow-md">
      {/* Container wrapper for continuous scroll */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around">
          <span className="text-lg md:text-xl font-extrabold tracking-wider uppercase px-4">
            {promoText}
          </span>
          <span className="text-lg md:text-xl font-extrabold tracking-wider uppercase px-4">
            {promoText}
          </span>
        </div>
        {/* Duplicate track for seamless infinite looping without gaps */}
        <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around" aria-hidden="true">
          <span className="text-lg md:text-xl font-extrabold tracking-wider uppercase px-4">
            {promoText}
          </span>
          <span className="text-lg md:text-xl font-extrabold tracking-wider uppercase px-4">
            {promoText}
          </span>
        </div>
      </div>

      {/* Global CSS injection for smooth marquee movement */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}