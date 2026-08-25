import React, { useEffect, useRef } from 'react';
import { User, Phone, MessageCircle, MapPin, Clock, Calendar, Truck } from 'lucide-react';

export default function LocationContact() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-3 block">
            Find Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Location & Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Host & Address Details */}
          <div className="space-y-5">
            {/* Host Card */}
            <div className="reveal-on-scroll bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center shrink-0 shadow-md">
                  <User size={28} className="text-black" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Sashikant Sikhare</h3>
                  <p className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                    Villa Host & Owner
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:+919820000000"
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors group border border-border/30"
                >
                  <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      Direct Call
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-amber-400 transition-colors">
                      +91 98200 00000
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919820000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-green-500/10 transition-colors group border border-border/30"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      WhatsApp
                    </p>
                    <p className="text-sm font-bold text-foreground group-hover:text-green-400 transition-colors">
                      Chat with Host
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="reveal-on-scroll bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-border/40">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground mb-0.5">Sai Villa</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Badlapur, Thane District<br />
                    Maharashtra 421503, India
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                {[
                  { icon: Clock, label: 'Check-In', value: '10:00 AM' },
                  { icon: Clock, label: 'Check-Out', value: '10:00 AM' },
                  { icon: Calendar, label: 'Open', value: '365 Days' },
                  { icon: Truck, label: 'From Mumbai', value: '~2 Hours' },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className="bg-white/5 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1">
                        <ItemIcon size={11} /> {item.label}
                      </p>
                      <p className="text-xs font-bold text-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="reveal-on-scroll">
              <button
                type="button"
                onClick={scrollToBooking}
                className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                <Calendar size={16} />
                Book Your Stay Now
              </button>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="reveal-on-scroll">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-border/40 h-full min-h-[350px]">
              <div className="p-3 border-b border-border/30 flex items-center gap-2">
                <MapPin size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Badlapur, Maharashtra
                </span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60302.28536!2d73.2240!3d19.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7974f5a5a4f4f%3A0x8b8b8b8b8b8b8b8b!2sBadlapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1699999999999"
                width="100%"
                height="350"
                style={{
                  border: 0,
                  filter: 'invert(0.85) hue-rotate(180deg) saturate(0.7)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sai Villa Location - Badlapur, Maharashtra"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}