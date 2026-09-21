'use client';

import { useState, useRef } from 'react';
import { Heart, Bookmark, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface LifestyleItem {
  id: string;
  imageUrl: string;
  title: string;
  linkUrl?: string;
}

const DEFAULT_ITEMS: LifestyleItem[] = [
  {
    id: '1',
    imageUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-3-2026-03_50_24-AM.png',
    title: 'Featured Tech Product 1',
  },
  {
    id: '2',
    imageUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/08/mobile-Version-5.png',
    title: 'Featured Tech Product 2',
  },
  {
    id: '3',
    imageUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-1-2026-04_34_15-PM.png',
    title: 'Featured Tech Product 3',
  },
  {
    id: '4',
    imageUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/08/mobile-Version-7.png',
    title: 'Featured Tech Product 4',
  },
];

interface ImageSliderProps {
  items?: LifestyleItem[];
}

export function ImageSlider({ items = DEFAULT_ITEMS }: ImageSliderProps) {
  const activeItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // 3D Tilt state tracking per card
  const [cardTransforms, setCardTransforms] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within card
    const y = e.clientY - rect.top;  // y position within card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle (max ±12 deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setCardTransforms((prev) => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
    }));
  };

  const handleMouseLeave = (id: string) => {
    setCardTransforms((prev) => ({
      ...prev,
      [id]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    }));
  };

  const handleScrollTo = (index: number) => {
    if (index < 0 || index >= activeItems.length) return;
    setActiveIndex(index);

    const container = containerRef.current;
    if (container) {
      const cardElements = container.querySelectorAll('.lifestyle-card');
      const targetCard = cardElements[index] as HTMLElement;
      if (targetCard) {
        container.scrollTo({
          left: targetCard.offsetLeft - container.offsetWidth / 2 + targetCard.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section className="w-full min-h-screen w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-transparent py-16 px-4 sm:px-8 flex flex-col justify-between border-y border-white/10 overflow-hidden">
      {/* Ambient Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-red-500/5 rounded-full blur-[180px] pointer-events-none -z-0" />

      {/* Modern & Attractive Header Container */}
      <div className="max-w-7xl mx-auto w-full mb-12 z-10 px-8 py-8 bg-white/5 backdrop-blur-4xl border border-slate-300 rounded-4xl flex flex-col sm:flex-row items-center justify-between gap-6 ">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles size={13} /> Curated Collections
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black uppercase font-Inter">
            Shop By <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">Lifestyle</span>
          </h2>
        </div>
        <p className="text-sm sm:text-base text-neutral-500 max-w-xs text-center sm:text-right">
          Discover hand-picked gear customized to elevate your daily rhythm and setup.
        </p>
      </div>

      {/* Main Coverflow Slider Container */}
      <div
        ref={containerRef}
        className="flex items-center justify-start lg:justify-center gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory py-10 px-6 scroll-smooth focus:outline-none z-10 max-w-7xl mx-auto w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {activeItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isFav = !!favorites[item.id];
          const isBookmarked = !!bookmarks[item.id];
          const customTransform = cardTransforms[item.id] || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

          return (
            <div
              key={item.id}
              onClick={() => handleScrollTo(index)}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
              style={{
                transform: customTransform,
                transition: 'transform 0.1s ease-out, opacity 0.5s ease, width 0.5s ease, height 0.5s ease',
              }}
              className={`lifestyle-card relative shrink-0 snap-center cursor-pointer rounded-3xl overflow-hidden border bg-neutral-900 group  ${
                isActive
                  ? 'w-[280px] sm:w-[320px] h-[480px] sm:h-[540px] z-20 border-white/30 opacity-100 '
                  : 'w-[220px] sm:w-[250px] h-[380px] sm:h-[440px] z-10 border-white/10 opacity-50 blur-[0.4px] hover:opacity-80'
              }`}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
              </div>

              {/* Top Action Icons (Heart & Bookmark) */}
              <div className="absolute top-5 inset-x-5 flex items-center justify-between z-30">
                <button
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition cursor-pointer shadow-lg"
                >
                  <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} />
                </button>
                <button
                  onClick={(e) => toggleBookmark(item.id, e)}
                  className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition cursor-pointer shadow-lg"
                >
                  <Bookmark size={16} className={isBookmarked ? 'fill-white text-white' : 'text-white'} />
                </button>
              </div>

              {/* Bottom "SHOP NOW" Action Area */}
              <div className="absolute bottom-6 inset-x-6 z-30 flex flex-col items-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full py-3 px-4 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
                >
                  Shop Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls & Dots */}
      <div className="flex items-center justify-center gap-5 mt-6 z-10">
        <button
          onClick={() => handleScrollTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="p-3.5 rounded-full bg-neutral-900/90 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-neutral-900 text-white transition-all duration-300 border border-white/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2">
          {activeItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleScrollTo(idx)}
              className={`h-2.5 transition-all rounded-full cursor-pointer ${
                idx === activeIndex ? 'w-10 bg-red-600 shadow-md shadow-red-600/30' : 'w-2.5 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => handleScrollTo(activeIndex + 1)}
          disabled={activeIndex === activeItems.length - 1}
          className="p-3.5 rounded-full bg-neutral-900/90 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-neutral-900 text-white transition-all duration-300 border border-white/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}