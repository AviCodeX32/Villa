import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const CATEGORIES = [
  'All',
  'Exterior',
  'Living Area',
  'Pool & Deck',
  'Bedrooms',
  'Dining & Kitchen',
  'Garden',
];

export default function GallerySection() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/gallery`);
        const data = await res.json();
        if (data.success) {
          // Filter out Hero photos
          const publicGallery = (data.photos || []).filter(
            (item) => !item.isHero && item.category !== 'Hero'
          );
          setGallery(publicGallery);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const filteredPhotos =
    activeCategory === 'All'
      ? gallery
      : gallery.filter((photo) => photo.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#090D16] text-[#F1F5F9] px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} /> Visual Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Explore Sai Villa
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-light">
            Take a closer look at our private estate, natural laterite stone architecture, and serene surroundings.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Large Image Grid */}
        {loading ? (
          <div className="text-center py-24 text-slate-500 text-sm animate-pulse">
            Loading luxury spaces...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm border border-dashed border-slate-800 rounded-3xl">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPhotos.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedImage(item.imageUrl)}
                className="group relative h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900 cursor-pointer shadow-2xl transition-all duration-500 hover:border-amber-500/60 hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                <img
                  src={item.imageUrl}
                  alt="Sai Villa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}