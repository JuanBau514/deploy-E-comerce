import Producto from '../Models/modeloProducto.js';
import db from '../Models/conection.js';
import { json } from 'express';

const productoactual = [];

const getProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const asignarProductoEditar = async (req, res) => {
    productoactual.pop();
    productoactual.push(req.body.codigo_producto);
    if (productoactual[0]) {
        res.status(200).json({ message: 'codigo establecido correctamente' });
    } else {
        res.status(500).json({ message: 'No se pudo guardar el codigo' });
    }
};

const getProducto = async (req, res) => {
    try {
        const producto = await Producto.findByCode(productoactual[0]);
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { nombre, descripcion, cantidad_disponible, precio, url_imagen, id_estado } = req.body;
        await Producto.update(
            productoactual[0],
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible,
            id_estado
        );
        productoactual.pop();
        res.status(200).json('Producto actualizado correctamente');
    } catch (error) {
        res.status(500).json('No se pudo actualizar el producto', error);
    }
};

const crearProducto = async (req, res) => {
    try {
        const { codigo_producto, nombre, descripcion, cantidad_disponible, precio, url_imagen, estado } = req.body;
        
        // Validaciones
        if (!codigo_producto || !nombre || !precio || !cantidad_disponible) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        await Producto.create(
            codigo_producto,
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible,
            estado
        );
        res.status(201).json({ message: 'Producto creado correctamente' });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { codigo_producto } = req.body;
        if (!codigo_producto) {
            return res.status(400).json({ error: 'Código de producto requerido' });
        }

        // Verificar si el producto tiene pedidos asociados
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM pedido_producto WHERE codigo_producto = ?', 
            [codigo_producto]
        );

        if (rows[0].count > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el producto porque tiene pedidos asociados. Por favor, márquelo como inactivo primero.' 
            });
        }

        const result = await Producto.delete(codigo_producto);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

export default {
    getProductos,
    asignarProductoEditar,
    getProducto,
    updateProducto,
    deleteProducto,
    crearProducto
};