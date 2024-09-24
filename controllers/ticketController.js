const Ticket = require('../models/ticket');

// Obtener tickets asignados al usuario autenticado
exports.getAllTickets = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {

        console.log(req.session.userId);
        const tickets = await Ticket.find({ assignedTo: req.session.userId })
        console.log(tickets);
        res.render('tickets', { tickets, userName: req.session.userName });
    } catch (err) {
        res.status(500).send('Error al obtener los tickets');
    }
};

// Crear ticket
exports.createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.redirect('/tickets');
    } catch (err) {
        res.status(500).send('Error al crear el ticket');
    }
};
