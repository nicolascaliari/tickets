const User = require('../models/user');

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error al crear el usuario');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (err) {
        res.status(500).send('Error al obtener los usuarios');
    }
};
