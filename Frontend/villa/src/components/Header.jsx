import React, { useState, useEffect } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Packages', href: '#packages' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d0907]/95 backdrop-blur-md shadow-2xl shadow-black/80 border-b border-amber-500/20 py-2 sm:py-3'
            : 'bg-gradient-to-b from-[#0d0907]/90 via-[#0d0907]/60 to-transparent backdrop-blur-[2px] py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            aria-label="Sai Villa Home"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center font-serif text-black font-extrabold text-sm shadow-md shadow-amber-500/20">
              SV
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-amber-400 group-hover:text-amber-300 transition-colors">
                Sai Villa
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                Badlapur
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A120C]/80 border border-white/10 rounded-full px-3 py-1.5 shadow-inner">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-amber-400 hover:bg-white/5 transition-all duration-200 uppercase tracking-wider cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('#booking')}
              className="hidden sm:flex px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <CalendarDays size={15} />
              Book Now
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-[#1A120C] border border-white/10 rounded-full text-neutral-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0d0907]/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 border-b border-amber-500/20"
          onClick={() => setMenuOpen(false)}
        >
          <nav className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-left py-3.5 border-b border-white/5 font-serif text-xl font-medium text-neutral-200 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick('#booking')}
              className="mt-6 w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg cursor-pointer"
            >
              Book Your Stay
            </button>
          </nav>
        </div>
      )}
    </>
  );
}