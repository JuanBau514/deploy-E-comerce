// filepath: /home/juanpbau/Proyectos/js/deploy-comercio/inaldulce_comercio/backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './Routes/userRuta.js';
import empresaRoutes from './Routes/userRuta.js'; // Asegúrate de importar todas las rutas necesarias

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000',  // Permitir el origen específico
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};

// Aplicar CORS antes de las rutas
app.use(cors(corsOptions));

// Middleware para analizar JSON y datos de formularios
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Rutas del backend
app.use('/api/users', userRoutes);
app.use('/api/empresas', empresaRoutes); // Asegúrate de agregar todas las rutas necesarias

// Ruta para manejar todas las demás solicitudes y servir el archivo HTML principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});