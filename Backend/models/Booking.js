const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    dates: [
      {
        type: String, // Format: YYYY-MM-DD
        required: true,
      },
    ],
    guests: {
      type: Number,
      required: true,
      default: 2,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    weekdayCount: {
      type: Number,
      default: 0,
    },
    weekendCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['reserved', 'booked', 'cancelled'],
      default: 'reserved', // Stays 'reserved' until admin confirms to 'booked'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'refunded'],
      default: 'confirmed',
    },
    upiTransactionId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for rapid date availability queries
bookingSchema.index({ dates: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);