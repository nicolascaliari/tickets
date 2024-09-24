const User = require('../models/user');

exports.showLoginForm = (req, res) => {
    res.render('login', { errorMessage: null });
};

exports.loginUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email : email });
        if (!user) {
            return res.render('login', { errorMessage: 'Usuario no encontrado' });
        }
        req.session.userId = user._id;
        req.session.userName = user.name;
        res.redirect('/tickets');
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
