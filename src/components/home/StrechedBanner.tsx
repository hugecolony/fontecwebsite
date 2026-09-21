"use client";

import Link from "next/link";

const WP_BASE_URL = "https://fontecmobiles.com";
const DEFAULT_BANNER_SRC = `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-banner--scaled.png`;

interface BannerProps {
  linkHref?: string;
  desktopImageSrc?: string;
  mobileImageSrc?: string;
}

export default function StrechedBanner({
  linkHref = "/collections/headphones",
  desktopImageSrc = DEFAULT_BANNER_SRC,
  mobileImageSrc = DEFAULT_BANNER_SRC,
}: BannerProps) {
  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <Link 
        href={linkHref} 
        className="relative block w-full overflow-hidden rounded-2xl sm:rounded-[32px] shadow-xl group focus:outline-none transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Responsive Aspect Ratio Container */}
        <div className="relative w-full aspect-[15/2] sm:aspect-[7.69/1] bg-transparent">
          <picture className="block absolute inset-0 w-full h-full">
            {/* Mobile Image Source */}
            <source media="(max-width: 640px)" srcSet={mobileImageSrc} />
            {/* Desktop Image Source */}
            <source media="(min-width: 641px)" srcSet={desktopImageSrc} />
            
            <img
              src={desktopImageSrc}
              alt="Fontec Promotional Banner"
              className="w-full h-full object-contain sm:object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </picture>
        </div>
      </Link>
    </div>
  );
}