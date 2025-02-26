import express from 'express';
import usuarioController from '../Controllers/usuarioController.js';
import empresaController from '../Controllers/empresaController.js';
import productoController from '../Controllers/productoController.js';
import rubroController from '../Controllers/rubroController.js';
import rolesController from '../Controllers/rolController.js';
import indicadorController from '../Controllers/indicadorController.js';
import pedidoController from '../Controllers/pedidoController.js';

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
router.post('/empresas', empresaController.createEmpresa); 
router.get('/empresas', empresaController.getEmpresas);
router.put('/empresas/:nit', empresaController.updateEmpresa); 
router.delete('/empresas/:id', empresaController.deleteEmpresa); 


// Ruta para obtener todos los rubros
router.get('/rubros', rubroController.getRubros);

// Ruta para obtener los datos de los indicadores
router.get('/indicadores', indicadorController.obtenerIndicadores);
router.get('/indicadores/pedidos', indicadorController.obtenerTotalPedidos);
router.get('/indicadores/clientes', indicadorController.obtenerTotalClientes);
router.get('/indicadores/administradores', indicadorController.obtenerTotalAdministradores);
router.get('/indicadores/productos', indicadorController.obtenerTotalProductos);


// Rutas para pedidos y pagos
router.post('/pedidos', pedidoController.crearPedido);
router.get('/pedidos', pedidoController.getPedidos);


export default router;