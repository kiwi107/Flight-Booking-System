const booking = require('../models/booking');


const createBooking = (req, res) => {
    fromAirport = req.body.fromAirport;
    toAirport = req.body.toAirport;
    departureDate = req.body.departureDate;
    returnDate = req.body.returnDate;
    fromCity = req.body.fromCity;
    toCity = req.body.toCity;
    fromCountry = req.body.fromCountry;
    toCountry = req.body.toCountry;
    classType = req.body.classType;
    tripType = req.body.tripType;
    //create a new booking
    try {
        const newBooking = new booking({
            user: req.user.username,
            fromAirport: fromAirport,
            toAirport: toAirport,
            departureDate: departureDate,
            returnDate: returnDate,
            fromCity: fromCity,
            toCity: toCity,
            fromCountry: fromCountry,
            toCountry: toCountry,
            classType: classType,
            tripType: tripType,
        });

        newBooking.save()
            .then((result) => {
                res.sendStatus(200);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
};

const getBookings = async (req, res) => {
    try{
    const bookings = await booking.find({ user: req.user.username })
    res.json({bookings: bookings});
    }catch (error) {
        res.status(500).send('Error fetching data');
    }    
};
const getBooking = async (req, res) => {
    try{
    const bookings = await booking.findById(req.params.id)
    res.json({bookings: bookings});
    }catch (error) {
        res.status(500).send('Error fetching data');
    }    
};

const editBooking = (req, res) => {
    //edit a booking
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    }
    const id = req.params.id;
    booking.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(updatedBooking => {
        if (!updatedBooking) {
            return res.status(404).send({ message: "Booking not found." });
        }
        res.status(200).send(updatedBooking);
    })
    .catch(err => {
        res.status(500).send({ message: "Error updating the booking." });
    });
};

const deleteBooking = (req, res) => {
    //delete a booking
    const id = req.params.id;
    booking.findByIdAndDelete(id)
    .then(deletedBooking => {
        if (!deletedBooking) {
            return res.status(404).send({ message: "Booking not found." });
        }
        res.status(200).send({ message: "Booking deleted successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: "Error deleting the booking." });
    });
};

module.exports = {
    createBooking, 
    getBookings,
    getBooking,
    editBooking,
    deleteBooking
};