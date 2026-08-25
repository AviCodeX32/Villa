import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DEFAULT_SLIDES = [
  {
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b287f7d5-1786294145354.png',
    alt: 'Luxury villa exterior at twilight, warm amber lighting, lush tropical gardens surrounding stone architecture',
    headline: 'Escape to Sai Villa',
    subtext: 'Luxury Farmhouse Getaway in Badlapur',
    badge: '₹1,500/person',
  },
  {
    image: 'https://images.unsplash.com/photo-1675271875600-ec62be271966',
    alt: 'Private swimming pool surrounded by tropical greenery, clear blue water reflecting warm sunlight',
    headline: 'Private Pool & Lush Lawns',
    subtext: 'Your Personal Paradise Awaits',
    badge: 'Pool Included',
  },
  {
    image: 'https://images.unsplash.com/photo-1730322046135-a754d71b7ec0',
    alt: 'Luxury stone bedroom interior, warm amber lighting, rustic laterite stone walls',
    headline: 'AC Stone Bedrooms',
    subtext: 'Authentic Laterite Stone Architecture',
    badge: 'AC Rooms',
  },
];

const DEFAULT_HEADLINES = [
  { headline: 'Escape to Sai Villa', subtext: 'Luxury Farmhouse Getaway in Badlapur', badge: '₹1,500/person' },
  { headline: 'Private Pool & Lush Lawns', subtext: 'Your Personal Paradise Awaits', badge: 'Pool Included' },
  { headline: 'AC Stone Bedrooms', subtext: 'Authentic Laterite Stone Architecture', badge: 'AC Rooms' },
  { headline: 'Serene Nature & Open Skies', subtext: 'Unwind with Friends & Family in Seclusion', badge: 'All Meals' },
  { headline: 'Exclusive Villa Rental', subtext: 'Private Access to the Entire 1-Acre Property', badge: 'Private Stay' },
];

const badges = ['Meals Included', 'Badlapur, Mumbai', 'Open 365 Days'];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch admin-uploaded hero slides from database
  useEffect(() => {
    const fetchHeroMedia = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/gallery`);
        const data = await res.json();

        if (data.success && data.photos) {
          // Filter exclusively for Hero category / isHero flag
          const heroUploads = data.photos
            .filter((item) => item.isHero === true || item.category === 'Hero')
            .slice(0, 5); // Ensure maximum 5 images

          if (heroUploads.length > 0) {
            const formattedSlides = heroUploads.map((item, index) => {
              const preset = DEFAULT_HEADLINES[index % DEFAULT_HEADLINES.length];
              return {
                image: item.imageUrl,
                alt: item.title || `Sai Villa Luxury View ${index + 1}`,
                headline: preset.headline,
                subtext: preset.subtext,
                badge: preset.badge,
              };
            });
            setSlides(formattedSlides);
          }
        }
      } catch (err) {
        console.error('Could not fetch hero images, using default slides:', err);
      }
    };

    fetchHeroMedia();
  }, []);

  const goTo = useCallback(
    (idx) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  // Auto slide interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length]);

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPackages = () => {
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSlide = slides[current] || slides[0];

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#090D16]">
      {/* Background Slides */}
      {slides.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 2 : 1,
          }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 sm:pb-24 px-6 sm:px-12 max-w-7xl mx-auto left-0 right-0">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            {activeSlide.badge}
          </span>
          {badges.map((b) => (
            <span
              key={b}
              className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-200 uppercase tracking-wider border border-white/10"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Headings */}
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-3 max-w-3xl leading-tight drop-shadow-md">
          {activeSlide.headline}
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8 font-light max-w-xl drop-shadow">
          {activeSlide.subtext}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={scrollToBooking}
            className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <CalendarDays size={16} />
            Book Your Stay
          </button>
          <button
            type="button"
            onClick={scrollToPackages}
            className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-400/50 text-amber-300 bg-black/20 backdrop-blur-md hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            <Star size={16} />
            View Packages
          </button>
        </div>
      </div>

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}