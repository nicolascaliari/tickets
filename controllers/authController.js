const User = require('../models/user');

// Mostrar el formulario de login
exports.showLoginForm = (req, res) => {
    res.render('login', { errorMessage: null });
};

// Manejar el login
exports.loginUser = async (req, res) => {
    const { email } = req.body;
    try {

        console.log(email);
        const user = await User.findOne({ email : email });

        if (!user) {
            return res.render('login', { errorMessage: 'Usuario no encontrado' });
        }

        // Guardar el ID del usuario en la sesión
        req.session.userId = user._id;
        req.session.userName = user.name;

        // Redirigir a los tickets del usuario
        res.redirect('/tickets');
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};

// Manejar el logout
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
