const airport = require('../models/airport');

const getAirports = async (req, res) => {
    try {
        const airports = await airport.find();
        res.json({
            airports: airports,
            user: req.user,
        });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
}

module.exports = {
    getAirports,
};