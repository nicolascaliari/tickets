const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostrar el formulario de login
router.get('/login', authController.showLoginForm);

// Manejar el login
router.post('/login', authController.loginUser);

// Manejar el logout
router.get('/logout', authController.logoutUser);

module.exports = router;
    