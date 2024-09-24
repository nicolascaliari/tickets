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


exports.getAllTickets = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const tickets = await Ticket.find({ assignedTo: req.session.userId })
            .populate('assignedTo', 'name') 
            .exec();
        const users = await User.find();
        res.render('tickets', {
            tickets,
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
        const tickets = await Ticket.find()
            .populate('assignedTo', 'name') 
            .exec();
        const users = await User.find();
        res.render('allTickets', {
            tickets,
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
        const ticket = await Ticket.find({ idTicket : query}).populate('assignedTo');
        if (!ticket) {
            return res.status(404).send('Ticket no encontrado');
        }
        res.render('tickets', { tickets: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar el ticket');
    }
};