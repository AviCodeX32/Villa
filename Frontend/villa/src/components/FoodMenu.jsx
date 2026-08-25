import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X, FileText } from 'lucide-react';

const vegItems = [
  'Suki Bhendi Masala',
  'Spicy Paneer Gravy',
  'Dal Tadka',
  'Steamed Rice',
  'Roti or Bhakri',
];

const nonVegItems = [
  'Chicken Sukha',
  'Chicken Gravy',
  'Steamed Rice',
  'Roti or Bhakri',
];

function MenuPosterModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 text-center text-foreground"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'linear-gradient(160deg, #2D1810 0%, #1A0F0A 40%, #2D1810 100%)' }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Close menu poster"
        >
          <X size={16} />
        </button>

        {/* Poster Content */}
        <div className="mb-6">
          <div className="w-16 h-px bg-amber-400 mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2 font-bold">Sai Villa</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-300 mb-1">
            Farmhouse Thali
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Badlapur, Maharashtra
          </p>
          <div className="w-16 h-px bg-amber-400 mx-auto mt-4" />
        </div>

        {/* Spice Note */}
        <div className="rounded-xl p-3 mb-6 bg-white/5 border border-primary/30">
          <p className="text-xs font-bold text-primary">
            🌶️ Authentic Maharashtrian Spicy Taste
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            No Sweet Curries · No Added Sugar · Pure Tradition
          </p>
        </div>

        {/* Veg Thali */}
        <div className="rounded-2xl p-5 mb-4 bg-white/5 border border-green-500/20 text-left">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🥗</span>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Veg Thali</h3>
              <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">
                Pure Vegetarian
              </span>
            </div>
          </div>
          <ul className="space-y-2">
            {vegItems.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground/85">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Veg Thali */}
        <div className="rounded-2xl p-5 mb-4 bg-white/5 border border-primary/20 text-left">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🍗</span>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Non-Veg Thali</h3>
              <span className="text-[10px] text-primary uppercase tracking-widest font-bold">
                Chicken Special
              </span>
            </div>
          </div>
          <ul className="space-y-2">
            {nonVegItems.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground/85">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Mutton & Fish */}
        <div className="rounded-xl p-4 text-center bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs font-bold text-accent mb-1">🐟 Mutton & Fish</p>
          <p className="text-[11px] text-muted-foreground">
            Available on request · Charges as per size & market availability
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            All meals freshly prepared · Served with love
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FoodMenu() {
  const [posterOpen, setPosterOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3 block">
            Farmhouse Kitchen
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Authentic Farmhouse Thali
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary/30">
            <span className="text-base">🌶️</span>
            <p className="text-xs sm:text-sm text-foreground/80 font-medium">
              Authentic Maharashtrian Spicy Taste — No Sweet Curries, No Added Sugar!
            </p>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Veg */}
          <div className="reveal-on-scroll rounded-2xl p-6 border border-green-500/15 bg-white/5 relative overflow-hidden transition-all duration-300 hover:border-green-500/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center text-2xl">
                🥗
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Veg Thali</h3>
                <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">
                  Pure Vegetarian
                </span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {vegItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Veg */}
          <div className="reveal-on-scroll rounded-2xl p-6 border border-primary/15 bg-white/5 relative overflow-hidden transition-all duration-300 hover:border-primary/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-2xl">
                🍗
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Non-Veg Thali</h3>
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">
                  Chicken Special
                </span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {nonVegItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mutton & Fish Note */}
        <div className="reveal-on-scroll rounded-xl p-4 flex items-center gap-3 mb-8 bg-amber-500/10 border border-amber-500/20">
          <span className="text-2xl shrink-0">🐟</span>
          <div>
            <p className="text-sm font-bold text-accent">Mutton & Fish Available on Request</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Charges as per size & market availability · Contact host to arrange
            </p>
          </div>
        </div>

        {/* View Poster CTA */}
        <div className="text-center reveal-on-scroll">
          <button
            type="button"
            onClick={() => setPosterOpen(true)}
            className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg hover:brightness-110 transition-all"
          >
            <FileText size={16} />
            View Full Menu Poster
          </button>
        </div>
      </div>

      {posterOpen && <MenuPosterModal onClose={() => setPosterOpen(false)} />}
    </section>
  );
}