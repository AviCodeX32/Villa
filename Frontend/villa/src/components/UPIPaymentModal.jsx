import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function UPIPaymentModal({ details, onClose, onConfirmed }) {
  const [copied, setCopied] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const upiId = '9820000000@okaxis';
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}%26pn=Sai%20Villa%26am=${details?.total}%26cu=INR`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txnId.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...details,
        upiTransactionId: txnId,
        guestName,
        guestPhone,
      };

      await onConfirmed(payload);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#1A0F0A] border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-foreground">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 size={56} className="text-emerald-400 mb-3 animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-foreground">Booking Confirmed!</h3>
            <p className="text-sm text-muted-foreground mt-1">Booking ID: {details?.id}</p>
            <p className="text-xs text-amber-400 mt-4">We will verify your payment and contact you shortly.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                UPI Payment Gateway
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">Complete Your Booking</h3>
              <p className="text-xs text-muted-foreground mt-1">Scan QR or transfer via UPI ID below</p>
            </div>

            {/* Total Badge */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center mb-5">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Amount to Pay</p>
                <p className="text-xs text-muted-foreground">
                  {details?.nights} Nights · {details?.guests} Guests
                </p>
              </div>
              <p className="font-serif text-2xl font-bold text-amber-400">
                ₹{details?.total?.toLocaleString('en-IN')}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center mb-5">
              <div className="p-2 bg-white rounded-xl shadow-md mb-2">
                <img src={upiQrUrl} alt="UPI QR Code" className="w-36 h-36" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-muted-foreground bg-black/40 px-3 py-1 rounded-md border border-white/10">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-amber-300"
                  title="Copy UPI ID"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Confirmation Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Full Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                placeholder="Phone Number (WhatsApp)"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="12-digit UPI UTR / Transaction ID"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-foreground placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                disabled={isSubmitting || !txnId}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                {isSubmitting ? 'Confirming...' : 'I Have Paid — Confirm Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}