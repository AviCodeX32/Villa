const Booking = require('../models/Booking');

/**
 * @desc    Get all booked and reserved dates to disable them on the calendar
 * @route   GET /api/bookings/booked-dates
 */
exports.getBookedDates = async (req, res) => {
  try {
    const activeBookings = await Booking.find({
      status: { $in: ['reserved', 'booked'] },
    }).select('dates status');

    const bookedSet = new Set();
    const reservedSet = new Set();

    activeBookings.forEach((b) => {
      if (b.status === 'booked') {
        b.dates.forEach((d) => bookedSet.add(d));
      } else if (b.status === 'reserved') {
        b.dates.forEach((d) => reservedSet.add(d));
      }
    });

    return res.status(200).json({
      success: true,
      bookedDates: Array.from(bookedSet),
      reservedDates: Array.from(reservedSet),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booked and reserved dates',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new multi-date reservation (sets initial status to 'reserved')
 * @route   POST /api/bookings/reserve
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      id,
      dates,
      guests,
      total,
      totalDays,
      weekdayCount,
      weekendCount,
      upiTransactionId,
      paymentStatus,
    } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one date for reservation.',
      });
    }

    // Check collision: prevent booking if any date is already 'reserved' or 'booked'
    const collision = await Booking.findOne({
      dates: { $in: dates },
      status: { $in: ['reserved', 'booked'] },
    });

    if (collision) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected dates are already reserved or booked.',
      });
    }

    const booking = await Booking.create({
      bookingId: id || `SV${Date.now().toString(36).toUpperCase()}`,
      dates,
      guests: guests || 2,
      totalAmount: total,
      totalDays: totalDays || dates.length,
      weekdayCount: weekdayCount || 0,
      weekendCount: weekendCount || 0,
      status: 'reserved',
      paymentStatus: paymentStatus || 'confirmed',
      upiTransactionId: upiTransactionId || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Dates successfully reserved! Awaiting admin confirmation.',
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create reservation',
      error: error.message,
    });
  }
};

/**
 * @desc    Admin: Confirm booking (transitions from 'reserved' to 'booked')
 * @route   PATCH /api/bookings/:id/confirm
 */
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { bookingId: id, status: 'reserved' },
      { status: 'booked' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found or already confirmed/cancelled.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully.',
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel a reservation or booking (releases the dates)
 * @route   PATCH /api/bookings/:id/cancel
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { bookingId: id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Dates are now available.',
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};