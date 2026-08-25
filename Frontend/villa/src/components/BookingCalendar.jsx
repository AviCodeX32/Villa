import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, CreditCard, PhoneCall, MessageCircle, CheckCircle2 } from 'lucide-react';
import UPIPaymentModal from './UPIPaymentModal';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_RATE = 1500;
const WEEKEND_RATE = 1800;
const ADMIN_PHONE = '919876543210'; // Replace with admin's WhatsApp/Phone number (country code + number)

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export default function BookingCalendar() {
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [monthOffset, setMonthOffset] = useState(0);

  const activeDate = useMemo(() => {
    return new Date(currentYear, currentMonth + monthOffset, 1);
  }, [currentYear, currentMonth, monthOffset]);

  const viewYear = activeDate.getFullYear();
  const viewMonth = activeDate.getMonth();

  const [bookedDates, setBookedDates] = useState([]);
  const [reservedDates, setReservedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [guests, setGuests] = useState(2);
  const [showPayModal, setShowPayModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [offlineSuccess, setOfflineSuccess] = useState(null);
  const [isSubmittingOffline, setIsSubmittingOffline] = useState(false);

  // Fetch booked & reserved dates from backend API with localStorage fallback
  const fetchAvailability = useCallback(async () => {
    try {
      const response = await fetch('/api/bookings/booked-dates');
      if (response.ok) {
        const data = await response.json();
        setBookedDates(data.bookedDates || []);
        setReservedDates(data.reservedDates || []);
        localStorage.setItem('saivilla_booked', JSON.stringify(data.bookedDates || []));
        localStorage.setItem('saivilla_reserved', JSON.stringify(data.reservedDates || []));
        return;
      }
    } catch {
      const savedBooked = localStorage.getItem('saivilla_booked');
      const savedReserved = localStorage.getItem('saivilla_reserved');
      if (savedBooked) setBookedDates(JSON.parse(savedBooked));
      if (savedReserved) setReservedDates(JSON.parse(savedReserved));
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const maxBookingDate = useMemo(() => {
    return new Date(currentYear, currentMonth + 6, 0);
  }, [currentYear, currentMonth]);

  const getDayStatus = (d) => {
    const key = dateKey(viewYear, viewMonth, d);
    const date = new Date(viewYear, viewMonth, d);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (date < todayMidnight || date > maxBookingDate) return 'past';
    if (bookedDates.includes(key)) return 'booked';
    if (reservedDates.includes(key)) return 'reserved';
    return 'available';
  };

  const handleDayClick = (d) => {
    const status = getDayStatus(d);
    if (status === 'past' || status === 'booked' || status === 'reserved') return;

    setOfflineSuccess(null);
    const key = dateKey(viewYear, viewMonth, d);
    setSelectedDates((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key].sort()
    );
  };

  const calcPrice = useCallback(() => {
    if (selectedDates.length === 0) return null;

    let weekdayCount = 0;
    let weekendCount = 0;

    selectedDates.forEach((key) => {
      const [y, m, d] = key.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      if (isWeekend(dateObj)) weekendCount++;
      else weekdayCount++;
    });

    const totalDays = weekdayCount + weekendCount;
    const total = (weekdayCount * WEEKDAY_RATE + weekendCount * WEEKEND_RATE) * guests;

    return {
      weekdayCount,
      weekendCount,
      totalDays,
      total,
    };
  }, [selectedDates, guests]);

  const pricing = calcPrice();

  const formatDate = (key) => {
    if (!key) return '';
    const [y, m, d] = key.split('-').map(Number);
    return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
  };

  // Online UPI Pay trigger
  const handleProceedToOnlinePay = () => {
    if (selectedDates.length === 0 || !pricing) return;
    const id = `SV${Date.now().toString(36).toUpperCase()}`;
    setBookingDetails({
      id,
      dates: selectedDates,
      guests,
      total: pricing.total,
      totalDays: pricing.totalDays,
      weekdayCount: pricing.weekdayCount,
      weekendCount: pricing.weekendCount,
      paymentMethod: 'online',
    });
    setShowPayModal(true);
  };

  // Offline / Contact Admin trigger
  const handleOfflineReservation = async () => {
    if (selectedDates.length === 0 || !pricing || isSubmittingOffline) return;
    setIsSubmittingOffline(true);

    const id = `SV${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      id,
      dates: selectedDates,
      guests,
      total: pricing.total,
      totalDays: pricing.totalDays,
      weekdayCount: pricing.weekdayCount,
      weekendCount: pricing.weekendCount,
      paymentMethod: 'offline',
      paymentStatus: 'pending',
    };

    try {
      await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Failed to sync offline reservation', err);
    }

    const updatedReserved = [
      ...reservedDates,
      ...selectedDates.filter((k) => !reservedDates.includes(k)),
    ];
    setReservedDates(updatedReserved);
    localStorage.setItem('saivilla_reserved', JSON.stringify(updatedReserved));

    setOfflineSuccess({
      id,
      dates: selectedDates,
      total: pricing.total,
      guests,
    });
    setSelectedDates([]);
    setIsSubmittingOffline(false);
  };

  const handlePaymentConfirmed = async (details) => {
    try {
      await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, status: 'reserved', paymentStatus: 'confirmed' }),
      });
    } catch (err) {
      console.error('Failed to sync reservation to database', err);
    }

    const updatedReserved = [
      ...reservedDates,
      ...details.dates.filter((k) => !reservedDates.includes(k)),
    ];
    setReservedDates(updatedReserved);
    localStorage.setItem('saivilla_reserved', JSON.stringify(updatedReserved));

    setSelectedDates([]);
    setShowPayModal(false);
  };

  const isSelectedDay = (d) => selectedDates.includes(dateKey(viewYear, viewMonth, d));

  return (
    <section className="py-12 sm:py-16 px-4 relative bg-[#0d0907]">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 mb-1.5 block">
            Live Availability
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-100 mb-1.5">
            Select Dates & Reserve
          </h2>
          <p className="text-xs text-neutral-400">
            Pick single or multiple days across the next 6 months
          </p>
        </div>

        {/* Compact Calendar Card */}
        <div className="bg-[#17110D]/90 backdrop-blur-md rounded-xl p-3.5 sm:p-5 border border-white/10 shadow-xl">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
              disabled={monthOffset === 0}
              className="w-7 h-7 bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed rounded-full flex items-center justify-center hover:bg-amber-400/20 text-neutral-200 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <h3 className="font-serif text-sm sm:text-base font-bold text-amber-400">
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button
              type="button"
              onClick={() => setMonthOffset((prev) => Math.min(5, prev + 1))}
              disabled={monthOffset >= 5}
              className="w-7 h-7 bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed rounded-full flex items-center justify-center hover:bg-amber-400/20 text-neutral-200 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1 text-center">
            {DAYS.map((day) => (
              <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const status = getDayStatus(d);
              const isSelected = isSelectedDay(d);
              const key = dateKey(viewYear, viewMonth, d);
              const isToday = key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());

              let cellClass =
                'relative w-full aspect-square rounded-md flex items-center justify-center text-[11px] font-semibold transition-all duration-150 ';

              if (status === 'past') {
                cellClass += 'text-neutral-600 cursor-not-allowed bg-white/[0.02]';
              } else if (status === 'booked') {
                cellClass += 'bg-red-600/30 text-red-300 border border-red-600/50 cursor-not-allowed';
              } else if (status === 'reserved') {
                cellClass += 'bg-rose-500/25 text-rose-300 border border-rose-500/40 cursor-not-allowed';
              } else if (isSelected) {
                cellClass += 'bg-amber-500 text-black font-bold scale-105 shadow-md shadow-amber-500/30';
              } else {
                cellClass += 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 cursor-pointer';
              }

              if (isToday && status === 'available' && !isSelected) {
                cellClass += ' ring-1 ring-amber-400/80';
              }

              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => handleDayClick(d)}
                  className={cellClass}
                  aria-label={`${d} ${MONTHS[viewMonth]} ${viewYear} - ${status}`}
                  disabled={status === 'past' || status === 'booked' || status === 'reserved'}
                >
                  {d}
                  {isSelected && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-2.5 border-t border-white/10 flex-wrap">
            {[
              { color: 'bg-emerald-500/20 border border-emerald-500/40', label: 'Available' },
              { color: 'bg-rose-500/25 border border-rose-500/40', label: 'Reserved (Pending)' },
              { color: 'bg-red-600/30 border border-red-600/50', label: 'Booked' },
              { color: 'bg-amber-500 text-black', label: 'Selected' },
              { color: 'bg-white/[0.03] text-neutral-600', label: 'Past' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-sm ${item.color}`} />
                <span className="text-[10px] text-neutral-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Reservation Confirmation Prompt */}
        {offlineSuccess && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-sm mb-1">
              <CheckCircle2 size={16} /> Dates Temporarily Reserved!
            </div>
            <p className="text-xs text-neutral-300 mb-3">
              Booking ID: <span className="font-mono text-amber-300 font-bold">{offlineSuccess.id}</span>
              <br />
              Please contact the host/admin now to arrange your offline payment and confirm your booking.
            </p>
            <div className="flex items-center justify-center gap-2">
              <a
                href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
                  `Hello Admin, I have reserved dates on Sai Villa (Booking ID: ${offlineSuccess.id}) for ${offlineSuccess.guests} guest(s). Selected dates: ${offlineSuccess.dates.join(', ')}. Total: ₹${offlineSuccess.total}. I would like to complete my payment offline.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md"
              >
                <MessageCircle size={14} /> WhatsApp Admin
              </a>
              <a
                href={`tel:+${ADMIN_PHONE}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all border border-white/10"
              >
                <PhoneCall size={14} /> Call Admin
              </a>
            </div>
          </div>
        )}

        {/* Selection & Pricing Panel */}
        <div className="mt-4 bg-[#17110D]/90 backdrop-blur-md rounded-xl p-3.5 sm:p-5 border border-white/10 shadow-xl">
          <div className="mb-3">
            <div className="bg-black/40 rounded-lg p-2.5 border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  Selected Dates ({selectedDates.length})
                </p>
                {selectedDates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedDates([])}
                    className="text-[10px] text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {selectedDates.length === 0 ? (
                <p className="text-xs text-neutral-400">Click any available date(s) on the calendar</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                  {selectedDates.map((key) => (
                    <span
                      key={key}
                      className="text-[11px] bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded"
                    >
                      {formatDate(key)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center justify-between mb-3 bg-black/40 rounded-lg p-2.5 border border-white/5">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Guests</p>
              <p className="text-xs font-bold text-white">{guests} {guests === 1 ? 'Person' : 'People'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-400/20 transition-colors border border-white/10 text-white cursor-pointer"
                aria-label="Decrease guests"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-bold text-amber-400 w-5 text-center">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(20, guests + 1))}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-400/20 transition-colors border border-white/10 text-white cursor-pointer"
                aria-label="Increase guests"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          {pricing && (
            <div className="rounded-lg p-3 mb-3 bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1.5">Price Breakdown</p>
              {pricing.weekdayCount > 0 && (
                <div className="flex justify-between text-xs mb-1 text-neutral-300">
                  <span>
                    {pricing.weekdayCount} weekday{pricing.weekdayCount > 1 ? 's' : ''} × ₹{WEEKDAY_RATE} × {guests} {guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <span className="font-semibold text-white">₹{(pricing.weekdayCount * WEEKDAY_RATE * guests).toLocaleString('en-IN')}</span>
                </div>
              )}
              {pricing.weekendCount > 0 && (
                <div className="flex justify-between text-xs mb-1 text-neutral-300">
                  <span>
                    {pricing.weekendCount} weekend day{pricing.weekendCount > 1 ? 's' : ''} × ₹{WEEKEND_RATE} × {guests} {guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <span className="font-semibold text-white">₹{(pricing.weekendCount * WEEKEND_RATE * guests).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between items-center">
                <span className="font-bold text-xs text-white">
                  Total ({pricing.totalDays} day{pricing.totalDays > 1 ? 's' : ''})
                </span>
                <span className="font-serif text-lg font-bold text-amber-400">₹{pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Dual Action Buttons (Online UPI + Offline Pay / Contact Admin) */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleProceedToOnlinePay}
              disabled={selectedDates.length === 0 || !pricing}
              className="flex-1 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <CreditCard size={14} /> Pay via UPI
            </button>

            <button
              type="button"
              onClick={handleOfflineReservation}
              disabled={selectedDates.length === 0 || !pricing || isSubmittingOffline}
              className="flex-1 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all cursor-pointer"
            >
              <PhoneCall size={14} /> Pay Offline (Contact Host)
            </button>
          </div>
        </div>
      </div>

      {showPayModal && bookingDetails && (
        <UPIPaymentModal
          details={bookingDetails}
          onClose={() => setShowPayModal(false)}
          onConfirmed={handlePaymentConfirmed}
        />
      )}
    </section>
  );
}