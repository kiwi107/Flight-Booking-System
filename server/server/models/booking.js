const mongoose = require('mongoose');



const bookingSchema = new mongoose.Schema({
    user: String,
    fromAirport: String,
    toAirport: String,
    departureDate: String,
    returnDate: String,
    fromCity: String,
    toCity: String,
    fromCountry: String,
    toCountry: String,
    classType: String,
    tripType: String,

});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
