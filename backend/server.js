import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './Routes/userRuta.js';
import empresaRoutes from './Routes/userRuta.js'; 

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
        "default-src 'self'; font-src 'self' data: https: fonts.gstatic.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;"
    );
    next();
});

app.use(cors(corsOptions));

// Middleware para analizar JSON y datos de formularios
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Rutas del backend
app.use('/api/users', userRoutes);
app.use('/api/empresa', empresaRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});