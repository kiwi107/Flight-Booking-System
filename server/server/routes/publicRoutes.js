const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const authenticateToken = require('../middleware/authenticateToken');





router.get('/airports', publicController.getAirports);
router.get('/check-auth', authenticateToken)


module.exports = router;