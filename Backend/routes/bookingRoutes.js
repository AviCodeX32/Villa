const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/booked-dates', bookingController.getBookedDates);
router.post('/reserve', bookingController.createBooking);
router.patch('/:id/confirm', bookingController.confirmBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;