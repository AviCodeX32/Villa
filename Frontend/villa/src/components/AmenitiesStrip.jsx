import React from 'react';

const amenities = [
  { emoji: '🏊', label: 'Private Pool', sub: 'Crystal Clear' },
  { emoji: '🛏️', label: 'AC Bedrooms', sub: 'Stone Architecture' },
  { emoji: '🍽️', label: '3 Meals / Day', sub: 'Included Always' },
  { emoji: '🌿', label: 'Garden Lawn', sub: 'Lush & Green' },
  { emoji: '📍', label: 'Badlapur', sub: '2 hrs from Mumbai' },
  { emoji: '✨', label: 'Luxury Stay', sub: 'Premium Experience' },
];

export default function AmenitiesStrip() {
  return (
    <div className="bg-secondary border-y border-border/50 py-5 overflow-hidden">
      <div className="flex items-stretch gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex items-stretch gap-0 min-w-max mx-auto">
          {amenities.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-6 py-3 snap-start shrink-0 ${
                i < amenities.length - 1 ? 'border-r border-border/40' : ''
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="text-sm font-bold text-foreground leading-tight">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}