const mongoose = require('mongoose');



const airportSchema = new mongoose.Schema({
    airportId: Number,
    name: String,
    city: String,
    country: String,
    iata: String,
    icao: String,
});

const Airport = mongoose.model('Airport', airportSchema);
module.exports = Airport;




