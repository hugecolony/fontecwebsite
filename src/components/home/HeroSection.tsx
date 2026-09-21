'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const WP_BASE_URL = 'https://www.fontecmobiles.com';

interface SlideContent {
  id: number;
  desktopImageUrl: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileImageUrl: string;
  mobileWidth: number;
  mobileHeight: number;
  alt: string;
}

const HERO_SLIDES: SlideContent[] = [
  {
    id: 1,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-1.png`,
    desktopWidth: 1953,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-1.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 1',
  },
  {
    id: 2,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-2.png`,
    desktopWidth: 1952,
    desktopHeight: 806,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-2.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 2',
  },
  {
    id: 3,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-3.png`,
    desktopWidth: 1954,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-3.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 3',
  },
  {
    id: 4,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-4.png`,
    desktopWidth: 1953,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-4.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 4',
  },
  {
    id: 5,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-5.png`,
    desktopWidth: 1953,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-5.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 5',
  },
  {
    id: 6,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-6.png`,
    desktopWidth: 1953,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-6.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 6',
  },
  {
    id: 7,
    desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-7.png`,
    desktopWidth: 1953,
    desktopHeight: 805,
    mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/08/mobile-Version-7.png`,
    mobileWidth: 1080,
    mobileHeight: 1350,
    alt: 'fontec Slide 7',
  },
  // {
  //   id: 8,
  //   desktopImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-8.png`,
  //   desktopWidth: 1953,
  //   desktopHeight: 805,
  //   // No dedicated mobile crop yet -> falls back to the desktop (landscape)
  //   // image. Its mobileWidth/mobileHeight are set to match, so the aspect
  //   // box below sizes itself correctly for THIS slide instead of forcing
  //   // the 4/5 portrait box (which would crop it badly) onto a landscape image.
  //   mobileImageUrl: `${WP_BASE_URL}/wp-content/uploads/2026/07/Fontec-Typo-1-8.png`,
  //   mobileWidth: 1953,
  //   mobileHeight: 805,
  //   alt: 'fontec Slide 8',
  // },
];

export function HeroSection() {
  const [slides, setSlides] = useState<SlideContent[]>(HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length, nextSlide]);

  const Controls = () => (
    <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 inset-x-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              'h-2 sm:h-2.5 rounded-full transition-all duration-300 shrink-0 cursor-pointer',
              index === currentSlide
                ? 'w-6 sm:w-8 bg-red-500 shadow-md shadow-red-500/50'
                : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md text-white transition-all active:scale-95 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const active = slides[currentSlide];

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      {/*
        MOBILE box (visible below `md`, i.e. < 768px): aspect ratio is set
        PER-SLIDE from that slide's actual mobileWidth/mobileHeight. This
        matters for slide 8, which has no dedicated portrait crop yet and
        falls back to a landscape image — its box now sizes correctly
        instead of squeezing a landscape image into a fixed 4/5 box.

        IMPORTANT: this uses the SAME breakpoint (`md`) as the desktop
        box below. Previously the aspect ratio switched at `sm` (640px)
        while the image swapped at `md` (768px), so between 640–767px you
        got the desktop aspect box paired with the mobile image — that
        mismatch was the root cause of the bad cropping.
      */}
      <section
        className="md:hidden relative block w-full overflow-hidden rounded-[28px] shadow-2xl focus:outline-none bg-neutral-950 select-none"
        style={{
          '--banner-speed': '700ms' as string,
          aspectRatio: `${active.mobileWidth} / ${active.mobileHeight}`,
        } as React.CSSProperties}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              style={{ transition: 'opacity var(--banner-speed) ease, visibility 0s linear var(--banner-speed)' }}
              className={cn(
                'absolute inset-0 w-full h-full overflow-hidden',
                isActive ? 'opacity-100 visible z-10 pointer-events-auto' : 'opacity-0 invisible z-0 pointer-events-none'
              )}
            >
              <Image
                src={slide.mobileImageUrl}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                className="object-cover object-center w-full h-full"
                sizes="100vw"
              />
            </div>
          );
        })}
        <Controls />
      </section>

      {/*
        DESKTOP / TABLET box (visible from `md` up, i.e. >= 768px): aspect
        ratio set PER-SLIDE from desktopWidth/desktopHeight. Same
        breakpoint as the mobile box above, on purpose.
      */}
      <section
        className="hidden md:block relative w-full overflow-hidden rounded-[36px] shadow-2xl group focus:outline-none transition-transform duration-300 hover:scale-[1.01] bg-neutral-950 select-none"
        style={{
          '--banner-speed': '700ms' as string,
          aspectRatio: `${active.desktopWidth} / ${active.desktopHeight}`,
        } as React.CSSProperties}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              style={{ transition: 'opacity var(--banner-speed) ease, visibility 0s linear var(--banner-speed)' }}
              className={cn(
                'absolute inset-0 w-full h-full overflow-hidden',
                isActive ? 'opacity-100 visible z-10 pointer-events-auto' : 'opacity-0 invisible z-0 pointer-events-none'
              )}
            >
              <Image
                src={slide.desktopImageUrl}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                className="object-cover object-center w-full h-full"
                sizes="100vw"
              />
            </div>
          );
        })}
        <Controls />
      </section>
    </div>
  );
}