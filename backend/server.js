import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './Routes/userRuta.js';
import empresaRoutes from './Routes/userRuta.js'; 
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
        'https://deploy-e-comerce-production.up.railway.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "font-src 'self' https://fonts.gstatic.com https://unpkg.com data:; " +
        "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://deploy-e-comerce-production.up.railway.app; " +
        "script-src 'self' 'unsafe-inline';"
    );
    next();
});

app.use(cors(corsOptions));

// Middleware para analizar JSON y datos de formularios
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Rutas del backend
app.use('/api/users', userRoutes);
app.use('/api/empresa', empresaRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function enviarCorreoRegistro(tipo, nombre, apellido, email, archivo) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Nuevo Registro de ${tipo}`,
        text: `Nombre: ${nombre}\nApellido: ${apellido}\nEmail: ${email}\nFecha de Registro: ${new Date().toLocaleString()}`,
        attachments: [
            {
                filename: archivo.originalname,
                content: archivo.buffer
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}

app.post('/api/enviarCorreoRegistro', upload.single('archivo'), (req, res) => {
    const { tipo, nombre, apellido, email } = req.body;
    const archivo = req.file;
    enviarCorreoRegistro(tipo, nombre, apellido, email, archivo);
    res.status(200).send('Correo enviado');
});