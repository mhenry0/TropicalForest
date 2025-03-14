// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para poder leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos (como el formulario HTML)
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');  // Suponiendo que el HTML está en una carpeta 'public'
});

// Ruta para manejar el formulario de contacto
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Configuración de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa el servicio que prefieras (Gmail en este caso)
    auth: {
      user: 'your-email@gmail.com', // Reemplaza con tu correo
      pass: 'your-email-password'  // Reemplaza con tu contraseña o usa OAuth2
    }
  });

  // Configurar el correo electrónico
  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com', // Correo donde recibirás los mensajes
    subject: 'Nuevo mensaje de contacto',
    text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Hubo un problema al enviar el correo');
    } else {
      console.log('Correo enviado: ' + info.response);
      res.status(200).send('Correo enviado correctamente');
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
