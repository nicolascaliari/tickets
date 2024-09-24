const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', isAuthenticated, ticketController.getAllTickets);
router.post('/create', isAuthenticated, ticketController.createTicket);

module.exports = router;
