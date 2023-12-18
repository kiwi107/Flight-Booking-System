const express = require('express');
const router = express.Router();
const services = require('../services/render');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');



// Render Views
router.get('/register', services.register);
router.get('/login', services.login);




// API's
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);


module.exports = router;