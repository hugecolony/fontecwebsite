'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureHighlightProps {
  wpImages?: {
    sourceUrl: string;
    altText?: string;
  }[];
}

const WP_BASE_URL = 'https://www.fontecmobiles.com';

export function FeatureHighlight({ wpImages }: FeatureHighlightProps) {
  const images = wpImages && wpImages.length > 0 ? wpImages : [
    {
      sourceUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/30.png`,
      altText: 'Fontec Feature Highlight - View 1',
    },
    {
      sourceUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/18.png`,
      altText: 'Fontec Feature Highlight - View 2',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationKey, setRotationKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trigger 360 Spin using a key counter to restart the animation cleanly on every click
  const handleRotateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the modal when clicking the spin button
    setRotationKey((prev) => prev + 1);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-12 max-w-[90rem] mx-auto overflow-hidden bg-transparent">
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[25rem] h-[25rem] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Typography, Angle Switcher & Actions */}
        <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-xs font-extrabold text-red-600">
              Next-Gen Engineering
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl xl:text-7xl font-black text-slate-900 tracking-tight uppercase leading-[1.05]">
            FEATURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-700">
              HIGHLIGHT
            </span>
          </h2>

          <p className="text-slate-600 text-lg sm:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Explore unmatched craftsmanship from every angle. Switch angles, enjoy continuous 3D motion, trigger a 360-degree rotation, or click the card to zoom in.
          </p>

          {/* Image Angle Switcher Tabs */}
          <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  currentIndex === index
                    ? 'bg-red-600 text-white shadow-[0_5px_20px_rgba(239,68,68,0.4)]'
                    : 'bg-white/60 dark:bg-neutral-800/60 text-slate-600 dark:text-slate-300 hover:bg-red-500/10 border border-slate-200 dark:border-neutral-700'
                }`}
              >
                Angle 0{index + 1}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              onClick={handleRotateClick}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm tracking-wider uppercase hover:from-red-700 hover:to-red-800 shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all duration-300 cursor-pointer active:scale-95 hover:shadow-[0_15px_35px_rgba(239,68,68,0.6)]"
            >
              Rotate 360° View
            </button>
          </div>
        </div>

        {/* Right Column: Glowing Transparent Glass Container & Animating Images */}
        <div className="lg:col-span-7 flex justify-center items-center perspective-[1600px] py-6">
          <div className="relative w-full flex justify-center items-center">
            
            {/* Pulsing Backdrop Glow */}
            <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-red-600/35 via-rose-500/25 to-orange-500/20 rounded-full blur-[90px] animate-pulse pointer-events-none -z-10" />

            <motion.div
              // Combines continuous floating with a triggered 360 spin via rotationKey
              key={rotationKey}
              animate={{
                y: [0, -18, 0],
                rotateZ: [0, 1.5, -1.5, 0],
                rotateX: [0, 4, -4, 0],
                rotateY: rotationKey > 0 ? [0, 360] : 0,
              }}
              transition={
                rotationKey > 0
                  ? {
                      rotateY: { duration: 1.0, ease: 'easeInOut' },
                      y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                      rotateZ: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                      rotateX: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                    }
                  : {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              onClick={() => setIsModalOpen(true)}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-[340px] sm:w-[640px] lg:w-[760px] xl:w-[860px] aspect-[4/5] cursor-pointer group flex items-center justify-center p-6 sm:p-10 rounded-[3rem] bg-white/30 backdrop-blur-3xl border border-white/60 dark:border-white/15 transition-shadow duration-500"
            >
              {/* Inner Glass Glow Reflections */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-red-600/10 rounded-[3rem] pointer-events-none" />

              {/* Animated Image Switcher Container */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={images[currentIndex].sourceUrl}
                      alt={images[currentIndex].altText || 'Device View'}
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, 860px"
                      className="object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_45px_75px_rgba(239,68,68,0.4)] transition-all duration-300"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Floating Helper Badge */}
              <div className="absolute bottom-6 inset-x-0 flex items-center justify-center px-6 pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 dark:border-white/10 pointer-events-auto">
                  🔍 Click Card to Zoom
                </span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[85vh] bg-neutral-900/50 border border-white/10 rounded-[2.5rem] p-6 flex items-center justify-center shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-red-600 text-white font-bold flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={images[currentIndex].sourceUrl}
                  alt="Zoomed View"
                  fill
                  className="object-contain p-6 drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)]"
                />
              </div>

              <div className="absolute bottom-6 text-center text-xs text-slate-400 uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                Full Resolution Preview • Click anywhere outside to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}