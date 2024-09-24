const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');  // Importamos el middleware de sesiones
const app = express();

// Configuración de vistas
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'mySecretKey',  // Debes reemplazar esto con una clave secreta fuerte
    resave: false,
    saveUninitialized: true
}));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://nicolascaliari28:iselec450@cluster0.xhcenwi.mongodb.net/tickets?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Rutas
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');  // Nueva ruta para login

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/', authRoutes);  // Usamos '/' para que el login sea la ruta principal

// Ruta principal (redirige a login)
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.redirect('/tickets');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
