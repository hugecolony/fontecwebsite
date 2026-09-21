'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

interface MenuItem {
  id: string;
  href: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'about-us', href: '/about', label: 'About Us' },
  { id: 'corporate-orders', href: '/corporate-orders', label: 'Corporate Orders' },
  { id: 'track-orders', href: '/track-order', label: 'Track Orders' },
  { id: 'contact-us', href: '/contact', label: 'Contact Us' },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: FaFacebook },
  { name: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { name: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
];

const ANNOUNCEMENT = '🚚 FREE SHIPPING ABOVE 5000 PKR';

export function Topbar() {
  return (
    <>
      {/* Light Glassmorphism Container */}
      <div className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-9 gap-4">
            
            {/* 1. Left: Social Media Icons */}
            <div className="flex items-center gap-3 shrink-0 pr-4 border-r border-slate-200">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-slate-500 hover:text-indigo-600 hover:scale-110 transition-all duration-150 flex items-center justify-center p-0.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>

            {/* 2. Middle: Continuous Marquee Banner */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center min-w-0">
              <div className="whitespace-nowrap inline-flex animate-marquee">
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-800 uppercase tracking-wider pr-10">
                  {ANNOUNCEMENT}
                </span>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-800 uppercase tracking-wider pr-10">
                  {ANNOUNCEMENT}
                </span>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-800 uppercase tracking-wider pr-10">
                  {ANNOUNCEMENT}
                </span>
                <span className="text-[11px] sm:text-[12px] font-semibold text-slate-800 uppercase tracking-wider pr-10">
                  {ANNOUNCEMENT}
                </span>
              </div>

              {/* Edge Fades adapted for Light Glass */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/80 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/80 to-transparent" />
            </div>

            {/* 3. Right: Menu Links */}
            <nav
              aria-label="Top navigation"
              className="hidden md:flex items-center gap-5 shrink-0 pl-4 border-l border-slate-200"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-[12px] font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-150 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

          </div>
        </div>
      </div>

      {/* Marquee Keyframe Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 12s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}