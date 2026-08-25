import React from 'react';
import { Camera, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram', icon: Camera },
  { href: 'https://facebook.com', label: 'Facebook', icon: Globe },
  { href: 'https://wa.me/919820000000', label: 'WhatsApp', icon: MessageCircle },
];

  const exploreLinks = [
    { label: 'Packages', href: '#packages' },
    { label: 'Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
  ];

  const contactLinks = [
    { label: 'Book Now', href: '#booking' },
    { label: 'Contact', href: '#contact' },
    { label: '+91 98200 00000', href: 'tel:+919820000000' },
  ];

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center font-serif text-black font-bold text-sm">
                SV
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-amber-400 leading-none block">
                  Sai Villa
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  Badlapur
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Your luxury escape from Mumbai's chaos — private pool, stone bedrooms & authentic Maharashtrian feasts.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-1">
              {socialLinks.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors border border-white/10"
                  >
                    <IconComponent size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Sai Villa, Badlapur. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}