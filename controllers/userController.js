const User = require('../models/user');

// Crear usuario
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error al crear el usuario');
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (err) {
        res.status(500).send('Error al obtener los usuarios');
    }
};
