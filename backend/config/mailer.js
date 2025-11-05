const nodemailer = require('nodemailer');


//configuracion de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail', //servicio de correo
  auth: {
    user: 'equiposalvambiente@gmail.com', // correo de envio de enlace de restablecimiento
    pass: 'zxwh tzkw scka wenc' //contraseña de aplicacion 
  }
});

module.exports = transporter;