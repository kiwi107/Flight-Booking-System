const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.post('/booking', bookingController.createBooking);
router.get('/booking', bookingController.getBookings);
router.get('/booking/:id', bookingController.getBooking);
router.put('/booking/:id', bookingController.editBooking);
router.delete('/booking/:id', bookingController.deleteBooking);


module.exports = router;
