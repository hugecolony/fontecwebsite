'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ReelVideo {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  author: {
    username: string;
    avatar: string;
  };
  caption: string;
  songTitle: string;
  likesCount: number;
  commentsCount: number;
}

const DEFAULT_VIDEOS: ReelVideo[] = [
  {
    id: '1',
    videoUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-27-at-5.34.46-PM.mp4',
    author: {
      username: 'fontec_mobiles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    caption: 'Latest arrivals and smartphone accessories! 📱✨ #fontec',
    songTitle: 'Original Audio - Fontec Mobiles',
    likesCount: 430,
    commentsCount: 12,
  },
  {
    id: '2',
    videoUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-27-at-5.32.57-PM.mp4',
    author: {
      username: 'fontec_mobiles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    caption: 'Premium quality gear for your everyday tech setup ⚡',
    songTitle: 'Trending Tech Beats',
    likesCount: 290,
    commentsCount: 5,
  },
  {
    id: '3',
    videoUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-27-at-5.32.28-PM.mp4',
    author: {
      username: 'fontec_mobiles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    caption: 'Unboxing and overview 🔥 Visit our store now!',
    songTitle: 'Vibrant Hip Hop - Beats',
    likesCount: 610,
    commentsCount: 24,
  },
  {
    id: '4',
    videoUrl: 'https://www.fontecmobiles.com/wp-content/uploads/2026/07/WhatsApp-Video-2026-07-27-at-5.34.46-PM.mp4',
    author: {
      username: 'fontec_mobiles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    caption: 'Discover the future of mobile connectivity.',
    songTitle: 'Ambient Wave',
    likesCount: 180,
    commentsCount: 3,
  },
];

interface VideoSliderProps {
  videos?: ReelVideo[];
}

export function VideoSlider({ videos = DEFAULT_VIDEOS }: VideoSliderProps) {
  const activeVideos = Array.isArray(videos) && videos.length > 0 ? videos : DEFAULT_VIDEOS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-play active video and pause others when activeIndex changes
  useEffect(() => {
    activeVideos.forEach((_, idx) => {
      const vid = videoRefs.current[idx];
      if (!vid) return;

      if (idx === activeIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeIndex, activeVideos]);

  const handleScrollTo = (index: number) => {
    if (index < 0 || index >= activeVideos.length) return;
    setActiveIndex(index);
    
    const container = containerRef.current;
    if (container) {
      const cardElements = container.querySelectorAll('.reel-card');
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
    <section className="w-full min-h-screen w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-neutral-950 py-16 px-4 sm:px-8 flex flex-col justify-between border-y border-white/10 overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-red-600/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
          Explore Videos
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2">
          Discover our latest highlights, unboxings, and tech gear in action.
        </p>
      </div>

      {/* Main Centered Horizontal Carousel Container */}
      <div
        ref={containerRef}
        className="flex items-center justify-start lg:justify-center gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-6 px-4 scroll-smooth focus:outline-none z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {activeVideos.map((reel, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={reel.id}
              onClick={() => handleScrollTo(index)}
              className={`reel-card relative shrink-0 snap-center transition-all duration-500 cursor-pointer rounded-2xl overflow-hidden shadow-2xl border bg-black ${
                isActive
                  ? 'w-[280px] sm:w-[320px] h-[480px] sm:h-[540px] scale-100 z-20 border-white/20 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                  : 'w-[220px] sm:w-[250px] h-[380px] sm:h-[440px] scale-95 z-10 border-white/5 opacity-50 blur-[0.5px] hover:opacity-80'
              }`}
            >
              {/* Video Element */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={reel.videoUrl}
                poster={reel.posterUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
              />

              {/* Sound Toggle (Only visible on active card) */}
              {isActive && (
                <div className="absolute top-4 right-4 z-30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted((prev) => !prev);
                    }}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls & Dots */}
      <div className="flex items-center justify-center gap-4 mt-8 z-10">
        <button
          onClick={() => handleScrollTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="p-3 rounded-full bg-neutral-800/80 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-neutral-800 text-white transition border border-white/10 shadow-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2">
          {activeVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleScrollTo(idx)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === activeIndex ? 'w-8 bg-red-600' : 'w-2 bg-neutral-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => handleScrollTo(activeIndex + 1)}
          disabled={activeIndex === activeVideos.length - 1}
          className="p-3 rounded-full bg-neutral-800/80 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-neutral-800 text-white transition border border-white/10 shadow-lg cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}