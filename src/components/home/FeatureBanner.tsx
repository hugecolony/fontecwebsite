'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, RefreshCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    subtitle: 'Same-Day Dispatch',
    hoverBg: 'group-hover:bg-indigo-50/90',
    hoverText: 'group-hover:text-indigo-600',
    hoverBorder: 'group-hover:border-indigo-200',
  },
  {
    icon: CreditCard,
    title: 'Cash on Delivery',
    subtitle: 'Pay On Arrival',
    hoverBg: 'group-hover:bg-emerald-50/90',
    hoverText: 'group-hover:text-emerald-600',
    hoverBorder: 'group-hover:border-emerald-200',
  },
  {
    icon: RefreshCcw,
    title: '30-Day Returns',
    subtitle: 'Hassle-Free',
    hoverBg: 'group-hover:bg-purple-50/90',
    hoverText: 'group-hover:text-purple-600',
    hoverBorder: 'group-hover:border-purple-200',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    subtitle: 'Real Humans',
    hoverBg: 'group-hover:bg-teal-50/90',
    hoverText: 'group-hover:text-teal-600',
    hoverBorder: 'group-hover:border-teal-200',
  },
];

export function FeatureBanner() {
  return (
    <div className="w-full max-w-full  mx-auto px-4 sm:px-8 lg:px-12 my-8 sm:my-12 font-['Inter',sans-serif]">
      {/* Inline styles for custom animated background gradient text */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>

      {/* Outer Banner Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-2xl sm:rounded-[32px]  shadow-2xl shadow-slate-200/60 px-6 sm:px-12 py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-8 transition-all duration-300 hover:shadow-indigo-100/50"
      >
        {/* Animated Main Headline */}
        <div className="text-center lg:text-left shrink-0">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
            <span className="bg-gradient-to-r from-[#3b3574] via-[#6366f1] to-[#3b3574] bg-clip-text text-transparent animate-gradient-text">
              Exceptional Quality
            </span>{' '}
            <span className="bg-gradient-to-r from-[#bf2033] via-[#ff5864] to-[#bf2033] bg-clip-text text-transparent animate-gradient-text">
              Delivered
            </span>
          </h3>
        </div>

        {/* Big Features Grid with Animated Motion Icons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-end gap-x-8 gap-y-6 w-full lg:w-auto">
          {features.map(({ icon: Icon, title, subtitle, hoverBg, hoverText, hoverBorder }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-3.5 sm:gap-4 group cursor-pointer"
            >
              {/* Scaled-up Icon Wrapper with Continuous Subtle Pulse */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.3,
                }}
                className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-full bg-slate-100/90 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${hoverBg} ${hoverBorder}`}
              >
                <Icon
                  size={28}
                  className={`text-slate-800 transition-transform duration-300 group-hover:rotate-6 ${hoverText}`}
                />
              </motion.div>

              {/* Label & Description */}
              <div className="text-left">
                <p className={`text-sm sm:text-base font-black text-slate-900 tracking-wide leading-tight transition-colors ${hoverText}`}>
                  {title}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}