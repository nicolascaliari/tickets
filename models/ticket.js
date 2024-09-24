const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['asignado a', 'en tratamiento', 'en pruebas de usuario', 'cerrado'],
    },
    priority: {
        type: String,
        enum: ['baja', 'medio', 'alta'],
    },
    sector: {
        type: String,
        enum: ['backend', 'frontend', 'design', 'marketing'],
    },
    idTicket: {
        type: String,  
        unique: true   
    },
    assignedTo: {
        type: String,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
