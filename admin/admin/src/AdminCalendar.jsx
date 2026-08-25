import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Loader2,
  X,
} from 'lucide-react';

export default function AdminCalendar({
  lockedDatesList = [],
  onLockDates,
  onUnlockDate,
  locking = false,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = current month, max = 5 (6 months total)
  const [selectedDates, setSelectedDates] = useState([]);
  const [lockReason, setLockReason] = useState('Host Reserved / Maintenance');

  // Compute active month based on offset
  const activeDate = new Date(today.getFullYear(), today.getMonth() + currentMonthIndex, 1);
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDayOffset = new Date(year, month, 1).getDay();

  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const handleDateClick = (dateStr, isPast, isLocked) => {
    if (isPast || isLocked) return;
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleCommit = () => {
    if (selectedDates.length === 0) return;
    onLockDates(selectedDates, lockReason, () => {
      setSelectedDates([]);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 6-Month Restricted Calendar */}
      <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <CalendarIcon size={20} className="text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Date Lock Calendar</h2>
              <p className="text-xs text-slate-400">Available window: Next 6 Months</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMonthIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-white px-2.5 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonthIndex((prev) => Math.min(5, prev + 1))}
              disabled={currentMonthIndex >= 5}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d} className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDayOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-14 rounded-xl bg-slate-900/20" />
          ))}

          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = formatDateString(year, month, dayNum);
            const thisDate = new Date(year, month, dayNum);
            thisDate.setHours(0, 0, 0, 0);

            const isPast = thisDate < today;
            const isLocked = lockedDatesList.includes(dateStr);
            const isSelected = selectedDates.includes(dateStr);

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDateClick(dateStr, isPast, isLocked)}
                disabled={isPast || isLocked}
                className={`h-14 rounded-2xl flex flex-col items-center justify-between p-2 border transition-all text-xs cursor-pointer ${
                  isPast
                    ? 'bg-slate-900/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                    : isLocked
                    ? 'bg-rose-950/30 border-rose-900/50 text-rose-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 text-slate-200'
                }`}
              >
                <span className="text-xs font-semibold">{dayNum}</span>
                {isPast ? (
                  <span className="text-[9px] text-slate-600 font-medium">Passed</span>
                ) : isLocked ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-rose-400 uppercase">
                    <Lock size={9} /> Locked
                  </span>
                ) : isSelected ? (
                  <span className="text-[9px] uppercase font-bold bg-slate-950 text-amber-300 px-1 py-0.5 rounded">
                    Selected
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-400 font-medium">Open</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700" />
            <span className="text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-amber-500" />
            <span className="text-slate-300 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-rose-950/80 border border-rose-800" />
            <span className="text-rose-400 font-medium">Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-slate-900 opacity-50" />
            <span className="text-slate-500">Past Date</span>
          </div>
        </div>
      </div>

      {/* Lock Confirmation and Active Locks Sidebar */}
      <div className="space-y-6">
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Lock size={15} className="text-amber-400" /> Lock Selected Slots
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {selectedDates.length === 0
              ? 'Click any future date to select.'
              : `${selectedDates.length} date slot(s) selected.`}
          </p>

          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 max-h-32 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
              {selectedDates.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => handleDateClick(d, false, false)}
                    className="hover:text-rose-400 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="e.g., Deep Cleaning / Owner Reserved"
                className="w-full bg-[#1F2937]/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={handleCommit}
              disabled={selectedDates.length === 0 || locking}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {locking ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {locking ? 'Locking Slots...' : `Lock Selected (${selectedDates.length})`}
            </button>
          </div>
        </div>

        {/* Existing Active Locks */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Unlock size={15} className="text-rose-400" /> Active Date Blocks ({lockedDatesList.length})
          </h3>
          <p className="text-xs text-slate-400 mb-4">Click unlock to open dates back up.</p>

          {lockedDatesList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No dates are currently locked.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {lockedDatesList.map((lockedDate) => (
                <div
                  key={lockedDate}
                  className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-xs"
                >
                  <span className="font-semibold text-rose-300">{lockedDate}</span>
                  <button
                    type="button"
                    onClick={() => onUnlockDate(lockedDate)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}