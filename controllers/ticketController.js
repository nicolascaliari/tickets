const Ticket = require('../models/ticket');
const User = require('../models/user');
const Counter = require('../models/counter');

const getNextTicketId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: 'ticket' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};


function calculateTimeElapsed(createdAt, currentDate) {
    const diffTime = Math.abs(currentDate - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
        return `${diffDays} días`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} meses`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} años`;
    }
}


exports.getAllTickets = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const tickets = await Ticket.find({ assignedTo: req.session.userId, status: { $ne: 'cerrado' } })
            .populate('assignedTo', 'name')
            .exec();
        const currentDate = new Date();
        const ticketsWithTimeElapsed = tickets.map(ticket => {
            const createdAt = new Date(ticket.createdAt);
            const timeElapsed = calculateTimeElapsed(createdAt, currentDate);
            return { ...ticket._doc, timeElapsed };
        });
        const users = await User.find();
        res.render('tickets', {
            tickets : ticketsWithTimeElapsed,
            users,
            userName: req.session.userName
        });
    } catch (err) {
        res.status(500).send('Error al obtener los tickets');
        console.error(err);
    }
};


exports.showCreateTicketForm = async (req, res) => {
    try {
        const users = await User.find();
        res.render('createTicket', { users });
    } catch (err) {
        res.status(500).send('Error al cargar el formulario de creación de ticket');
    }
};


exports.createTicket = async (req, res) => {
    try {
        const { title, description, priority, sector, assignedTo, status } = req.body;
        const idTicket = await getNextTicketId();
        const ticket = new Ticket({
            title,
            description,
            priority,
            sector,
            status,
            assignedTo,
            createdAt: new Date(),
            idTicket: `#${idTicket}`
        });
        await ticket.save();
        res.redirect('/tickets');
    } catch (err) {
        console.error(err);
    }
};


exports.getAllTicketsForAllUsers = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const tickets = await Ticket.find({
            status: { $ne: 'cerrado' }
        })
            .populate('assignedTo', 'name')
            .exec();
        const users = await User.find();
        const currentDate = new Date(); 
        const ticketsWithTimeElapsed = tickets.map(ticket => {
            const createdAt = new Date(ticket.createdAt); 
            const timeElapsed = calculateTimeElapsed(createdAt, currentDate); 
            return { ...ticket._doc, timeElapsed };
        });
        res.render('allTickets', {
            tickets: ticketsWithTimeElapsed,
            users,
            userName: req.session.userName
        });
    } catch (err) {
        res.status(500).send('Error al obtener los tickets');
        console.error(err);
    }
};


exports.showEditTicketForm = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await Ticket.findById(ticketId).populate('assignedTo');
        const users = await User.find();
        if (!ticket) {
            return res.status(404).send('Ticket no encontrado');
        }
        res.render('editTicket', { ticket, users });
    } catch (error) {
        res.status(500).send('Error al obtener el ticket');
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { title, description, priority, sector, status, assignedTo } = req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {
            title,
            description,
            priority,
            sector,
            status,
            assignedTo
        }, { new: true });

        if (!updatedTicket) {
            return res.status(404).send('Ticket no encontrado');
        }
        res.redirect('/tickets');
    } catch (error) {
        res.status(500).send('Error al actualizar el ticket');
    }
};


exports.searchTickets = async (req, res) => {
    const query = req.query.query;
    try {
        const ticket = await Ticket.find({ idTicket: query, status: { $ne: 'cerrado' } }).populate('assignedTo');
        if (!ticket) {
            return res.status(404).send('Ticket no encontrado');
        }
        res.render('tickets', { tickets: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar el ticket');
    }
};