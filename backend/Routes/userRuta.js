import express from 'express';
import usuarioController from '../Controllers/usuarioController.js';
import empresaController from '../Controllers/empresaController.js';
import productoController from '../Controllers/productoController.js';
import rubroController from '../Controllers/rubroController.js';
import rolesController from '../Controllers/rolController.js';
import indicadorController from '../Controllers/indicadorController.js'
import multer from 'multer';

const upload = multer({ dest: '../uploads' }); // Directorio temporal para archivos

const router = express.Router();

// Ruta de registro
router.post('/registrarPersonaNatural', upload.single('rut'), usuarioController.createPersonaNatural);
// Ruta para enviar correo de registro de empresa
router.post('/enviar-correo', empresaController.enviarCorreo);

// Rutas de usuarios
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios', usuarioController.getUsuarios);
router.put('/usuarios', usuarioController.updateUsuario);
router.post('/createAdmin', usuarioController.createAdmin);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);
// Obtener usuario por cédula
router.get('/usuarios/:cedula', usuarioController.getUsuarioByCedula);

// Rutas de roles
router.get('/roles', rolesController.getRoles);

// Rutas para productos
router.get('/productos', productoController.getProductos);
router.put('/productos', productoController.updateProducto);
router.post('/productos', productoController.crearProducto);
router.post('/establecerProductoParaEdicion', productoController.asignarProductoEditar);
router.get('/productoUnidad', productoController.getProducto);
router.delete('/productos', productoController.deleteProducto);

// Ruta de login
router.post('/login', usuarioController.login);

// Rutas de empresas
router.get('/empresas', empresaController.getEmpresas);
router.put('/empresas', empresaController.updateEmpresa);
router.delete('/empresas/:id', empresaController.deleteEmpresa);

// Ruta para obtener todos los rubros
router.get('/rubros', rubroController.getRubros);


// Ruta para obtener los datos de los indicadores
router.get('/indicadorGeneral', indicadorController.obtenerInformacion);
router.get('/indicadorEspecifico', indicadorController.obtenerReporte);

export default router;
