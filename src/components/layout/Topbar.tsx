'use client';

import React from 'react';
import Link from 'next/link';
const FacebookIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const InstagramIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const YoutubeIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

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
  { name: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { name: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { name: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
];

const ANNOUNCEMENT = '🚚 FREE SHIPPING ABOVE 5000 PKR';

export function Topbar() {
  return (
    <>
      {/* Light Glassmorphism Container */}
      <div className="w-full bg-white/5 relative z-40 backdrop-blur-md border-b border-white/10 dark:border-white/5 relative z-40 transition-colors duration-300 ">
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
                    className="text-slate-500 hover:text-red-600 hover:scale-110 transition-all duration-150 flex items-center justify-center p-0.5"
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
                  className="text-[12px] font-medium text-slate-600 hover:text-red-600 transition-colors duration-150 whitespace-nowrap"
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