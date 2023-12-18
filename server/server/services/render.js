const axios = require('axios');
const airport = require('../models/airport');

exports.homeRoutes = async (req, res) => {
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

exports.register = (req, res) => {
    res.render('register', { user: req.user });
}

exports.login = (req, res) => {
    res.render('login', { user: req.user  }); 
}




