require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Importa pregRouter
const pregRouter = require('./routes/pregRouter.js');

const app = express();

app.use(cors());
app.use(express.json()); // Para analizar JSON
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios
app.use(cookieParser());
app.use(morgan('tiny')); // Mantenemos el logger de Morgan

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Usa tu email desde las variables de entorno
        pass: process.env.EMAIL_PASS, // Usa la contraseña o contraseña de aplicación
    },
});

// Ruta para procesar el formulario de contacto
app.post('/send-email', (req, res) => {
    const { nombre, correo, telefono, asunto, direccion, mensaje } = req.body;

    // Contenido del correo
    let mailOptions = {
        from: process.env.EMAIL_USER, // Tu correo
        to: 'destinatario@mi-reina-isabella.com', // Correo de destino
        subject: `Nuevo mensaje de ${nombre}: ${asunto}`,
        text: `
        Nombre: ${nombre}
        Correo: ${correo}
        Teléfono: ${telefono || 'No proporcionado'}
        Dirección: ${direccion || 'No proporcionada'}
        
        Mensaje:
        ${mensaje}
        `,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error al enviar el correo.');
        }
        console.log('Correo enviado: ' + info.response);
        res.status(200).send('Correo enviado exitosamente.');
    });
});

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'Home')));
app.use('/Contacto', express.static(path.resolve('views', 'Contacto')));
app.use('/Servicio', express.static(path.resolve('views', 'Servicio')));
app.use('/Resena', express.static(path.resolve('views', 'Resena')));
app.use('/whoIsRIS', express.static(path.resolve('views', 'whoIsRIS')));
app.use('/images', express.static(path.resolve('img')));
app.get('/faq', (req, res) => {
    res.sendFile(path.resolve('views', 'Home', 'faq.html'));
});

// Rutas backend
app.use('/api/Preg', pregRouter);

// Configura el puerto para que sea 3001
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;