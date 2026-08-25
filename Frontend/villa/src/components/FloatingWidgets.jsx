import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp } from 'lucide-react';

export default function FloatingWidgets() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/919820000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat with Sai Villa on WhatsApp"
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </a>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 w-10 h-10 bg-black/50 backdrop-blur-md border border-accent/30 rounded-full flex items-center justify-center hover:bg-accent/20 transition-all hover:scale-110 text-foreground"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}