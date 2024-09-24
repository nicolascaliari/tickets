const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}
router.get('/', isAuthenticated, ticketController.getAllTickets);
router.get('/all', isAuthenticated, ticketController.getAllTicketsForAllUsers);
router.get('/edit/:id', isAuthenticated, ticketController.showEditTicketForm);
router.get('/search', isAuthenticated, ticketController.searchTickets);
router.post('/edit/:id', isAuthenticated, ticketController.updateTicket);
router.get('/create', isAuthenticated, ticketController.showCreateTicketForm);
router.post('/create', isAuthenticated, ticketController.createTicket);

module.exports = router;
