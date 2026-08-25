import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  Upload,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import AdminCalendar from './AdminCalendar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('saivilla_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('calendar');

  const [lockedDatesList, setLockedDatesList] = useState([]);
  const [locking, setLocking] = useState(false);

  // Hero Upload (Max 5)
  const [heroImages, setHeroImages] = useState([]);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [heroUploading, setHeroUploading] = useState(false);

  // Gallery Upload (Category only)
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Exterior');
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchAllData = useCallback(async () => {
    try {
      const lockRes = await fetch(`${API_BASE}/api/bookings/locked-dates`);
      if (lockRes.ok) {
        const lockData = await lockRes.json();
        if (lockData.success) {
          setLockedDatesList(lockData.lockedDates || []);
        }
      }

      const mediaRes = await fetch(`${API_BASE}/api/admin/gallery`);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (mediaData.success) {
          const allPhotos = mediaData.photos || [];
          setHeroImages(allPhotos.filter((item) => item.isHero || item.category === 'Hero'));
          setGalleryImages(allPhotos.filter((item) => !item.isHero && item.category !== 'Hero'));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    if (token) fetchAllData();
  }, [token, fetchAllData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    setLoginLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('saivilla_admin_token', data.token);
        setStatusMsg({ type: 'success', text: 'Logged in successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Invalid credentials' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Backend is unreachable.' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('saivilla_admin_token');
    setStatusMsg({ type: 'info', text: 'Logged out successfully.' });
  };

  // Lock multi dates
  const handleLockDates = async (selectedDates, reason, onSuccess) => {
    setLocking(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/admin/lock-dates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dates: selectedDates, reason }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Locked ${selectedDates.length} date slot(s).` });
        if (onSuccess) onSuccess();
        fetchAllData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to lock dates.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setLocking(false);
    }
  };

  const handleUnlockSingleDate = async (dateStr) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: dateStr }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Unlocked date: ${dateStr}` });
        fetchAllData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Could not unlock date.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Error unlocking date.' });
    }
  };

  // Hero Upload
  const handleHeroUpload = async (e) => {
    e.preventDefault();
    if (!heroFile) return;

    if (heroImages.length >= 5) {
      setStatusMsg({ type: 'error', text: 'Hero is limited to 5 images max. Delete an existing image first.' });
      return;
    }

    setHeroUploading(true);
    setStatusMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', heroFile);
    formData.append('category', 'Hero');
    formData.append('isHero', 'true');

    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Hero image uploaded!' });
        setHeroFile(null);
        setHeroPreview('');
        fetchAllData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Upload failed.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error uploading hero image.' });
    } finally {
      setHeroUploading(false);
    }
  };

  // Gallery Upload
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;

    setGalleryUploading(true);
    setStatusMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('category', galleryCategory);
    formData.append('isHero', 'false');

    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Photo added to gallery!' });
        setGalleryFile(null);
        setGalleryPreview('');
        fetchAllData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Upload failed.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error uploading gallery photo.' });
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Permanently delete this photo?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Photo deleted.' });
        fetchAllData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Delete failed.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Error deleting photo.' });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#090D16] text-[#F1F5F9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Host Admin Login</h1>
              <p className="text-xs text-slate-400">Sai Villa Management</p>
            </div>
          </div>

          {statusMsg.text && (
            <div className="mb-4 p-3 rounded-xl text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-2">
              <AlertCircle size={14} />
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="avi"
                className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F1F5F9] font-sans antialiased pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm">
              SV
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Sai Villa Host Center</h1>
              <p className="text-[11px] text-slate-400 font-medium">Availability & Media Controls</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'calendar' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                Date Lock Manager
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'hero' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                <Sparkles size={13} /> Hero Showcase ({heroImages.length}/5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'gallery' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                Gallery Photos ({galleryImages.length})
              </button>
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 hover:bg-rose-500/20 cursor-pointer"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {statusMsg.text && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-lg ${
              statusMsg.type === 'error'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{statusMsg.text}</span>
            </div>
            <button type="button" onClick={() => setStatusMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tab 1: 6-Month Restricted Calendar */}
        {activeTab === 'calendar' && (
          <AdminCalendar
            lockedDatesList={lockedDatesList}
            onLockDates={handleLockDates}
            onUnlockDate={handleUnlockSingleDate}
            locking={locking}
          />
        )}

        {/* Tab 2: Hero Showcase (Max 5) */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" /> Hero Section Images
                  </h2>
                  <p className="text-xs text-slate-400">Featured images on the villa homepage (Max 5).</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <span>Active Slots:</span>
                  <span className="text-sm font-black text-white">{heroImages.length} / 5</span>
                </div>
              </div>

              <form onSubmit={handleHeroUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                    Select Hero Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setHeroFile(file);
                        setHeroPreview(URL.createObjectURL(file));
                      }
                    }}
                    disabled={heroImages.length >= 5 || heroUploading}
                    className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-2xl p-3 text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col items-center sm:items-end justify-center">
                  {heroPreview && (
                    <div className="w-28 h-16 rounded-xl overflow-hidden border border-amber-400/50 mb-3 shadow-md">
                      <img src={heroPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!heroFile || heroImages.length >= 5 || heroUploading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {heroUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {heroUploading ? 'Uploading...' : 'Save to Hero'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Live Hero Slides ({heroImages.length})</h3>
              {heroImages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No hero images uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {heroImages.map((photo, index) => (
                    <div key={photo._id} className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
                      <img src={photo.imageUrl} alt="Hero Slide" className="w-full h-44 object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-950/80 border border-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-400">
                        Slide #{index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo._id)}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-rose-600 text-white opacity-90 group-hover:opacity-100 hover:bg-rose-700 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Gallery Photos (Category Only) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="pb-5 border-b border-slate-800 mb-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-amber-400" /> Villa Gallery Photos
                </h2>
                <p className="text-xs text-slate-400">Select category and upload directly without requiring titles.</p>
              </div>

              <form onSubmit={handleGalleryUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Category</label>
                  <select
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Exterior">Exterior</option>
                    <option value="Living Area">Living Area</option>
                    <option value="Pool & Deck">Pool & Deck</option>
                    <option value="Bedrooms">Bedrooms</option>
                    <option value="Dining & Kitchen">Dining & Kitchen</option>
                    <option value="Garden">Garden</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Select Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setGalleryFile(file);
                        setGalleryPreview(URL.createObjectURL(file));
                      }
                    }}
                    required
                    className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-2xl p-2.5 text-xs text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {galleryPreview && (
                    <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-700 shadow-sm shrink-0">
                      <img src={galleryPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!galleryFile || galleryUploading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {galleryUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {galleryUploading ? 'Uploading...' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Live Photos ({galleryImages.length})</h3>
              {galleryImages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No gallery photos added yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryImages.map((photo) => (
                    <div key={photo._id} className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
                      <img src={photo.imageUrl} alt={photo.category} className="w-full h-40 object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-slate-950/80">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block truncate">
                          {photo.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo._id)}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-rose-600 text-white opacity-90 group-hover:opacity-100 hover:bg-rose-700 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}