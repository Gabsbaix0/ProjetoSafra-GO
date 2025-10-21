const nodemailer = require('nodemailer');

// Carrega as variáveis do .env para process.env
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // false para a porta 587 (TLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;