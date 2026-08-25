import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Star } from 'lucide-react';

const commonFeatures = [
  'Breakfast, Lunch & Dinner',
  'Private Swimming Pool Access',
  'Lush Garden & Lawn',
  'AC Stone Bedroom',
  'Host Assistance',
  'Check-in 10 AM / Out 10 AM',
];

export default function PackagesPricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#0d0907]">
      {/* Background Ambience Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-3 block">
            Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Stay
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
            All packages include authentic Maharashtrian 3-time meals. No hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Weekday Card */}
          <div className="reveal-on-scroll flex flex-col justify-between bg-[#17110D]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-xl transition-all duration-300 hover:border-amber-500/30">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            
            {/* Top Section */}
            <div>
              {/* Header Row */}
              <div className="flex items-center justify-between min-h-[28px] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Weekday Rate
                </span>
                <span className="text-xs text-neutral-400 font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                  Mon – Fri
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  ₹1,500
                </span>
                <span className="text-neutral-400 text-sm font-medium">/person</span>
              </div>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-6">
                Includes 3-Time Meals
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {commonFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-neutral-200">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {/* Visual spacer to match the extra item on the weekend card */}
                <li className="hidden sm:flex items-center gap-3 text-sm text-transparent select-none" aria-hidden="true">
                  <Star size={16} className="shrink-0 opacity-0" />
                  <span>Placeholder Spacer</span>
                </li>
              </ul>
            </div>

            {/* Pinned Button */}
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={scrollToBooking}
                className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider border border-amber-400/50 text-amber-300 hover:bg-amber-400/10 transition-all cursor-pointer"
              >
                Book Weekday Stay
              </button>
            </div>
          </div>

          {/* Weekend Card */}
          <div className="reveal-on-scroll flex flex-col justify-between bg-[#1A120D] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-amber-500/70">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {/* Top Section */}
            <div>
              {/* Header Row */}
              <div className="flex items-center justify-between min-h-[28px] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Weekend Rate
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Special
                  </span>
                  <span className="text-xs text-neutral-300 font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    Sat – Sun
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 tracking-tight">
                  ₹1,800
                </span>
                <span className="text-neutral-400 text-sm font-medium">/person</span>
              </div>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-6">
                Includes 3-Time Meals
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {commonFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-neutral-200">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-sm text-amber-300 font-semibold">
                  <Star size={16} className="text-amber-400 fill-amber-400/20 shrink-0" />
                  <span>Weekend Special Experience</span>
                </li>
              </ul>
            </div>

            {/* Pinned Button */}
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={scrollToBooking}
                className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                Book Weekend Stay
              </button>
            </div>
          </div>

        </div>

        {/* Footer Subtext */}
        <p className="text-center text-xs text-neutral-400 mt-8 reveal-on-scroll">
          Prices per person per night · Group discounts available · Contact host for bulk bookings
        </p>
      </div>
    </section>
  );
}