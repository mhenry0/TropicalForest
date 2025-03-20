require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para manejar el formulario de contacto
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'Nuevo mensaje de contacto',
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado correctamente.' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Hubo un problema al enviar el correo.' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
