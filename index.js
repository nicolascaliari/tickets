require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');  
const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'mySecretKey',  
    resave: false,
    saveUninitialized: true
}));


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));


const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes'); 
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/', authRoutes); 


app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.redirect('/tickets');
});

app.listen(process.env.PORT, () => {
    console.log('Server running on port 3000');
});
