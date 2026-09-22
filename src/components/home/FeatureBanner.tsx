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
    <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 my-8 sm:my-12 font-['Inter',sans-serif]">
      {/* Outer Banner Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-2xl sm:rounded-[32px] shadow-2xl shadow-slate-200/60 px-6 sm:px-12 py-8 sm:py-10 flex items-center justify-center transition-all duration-300 hover:shadow-indigo-100/50"
      >
        {/* Centered Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-center gap-8 sm:gap-10 w-full max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, subtitle, hoverBg, hoverText, hoverBorder }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3.5 sm:gap-4 group cursor-pointer"
            >
              {/* Scaled-up Animated Icon Wrapper */}
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
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-full bg-slate-100/90 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${hoverBg} ${hoverBorder}`}
              >
                <Icon
                  size={32}
                  className={`text-slate-800 transition-transform duration-300 group-hover:rotate-6 ${hoverText}`}
                />
              </motion.div>

              {/* Centered/Aligned Label & Subtitle */}
              <div className="flex flex-col items-center sm:items-start">
                <p className={`text-base sm:text-lg font-black text-slate-900 tracking-wide leading-tight transition-colors ${hoverText}`}>
                  {title}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
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

export default FeatureBanner;