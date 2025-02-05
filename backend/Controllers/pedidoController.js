import Pedido from '../Models/modeloPedido.js';
import db from '../Models/conection.js';

const crearPedido = async (req, res) => {
    try {
        const { cedula_usuario, productos, total } = req.body;
        
        // Validaciones
        if (!cedula_usuario || !productos || !total) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos para crear el pedido'
            });
        }

        const resultado = await Pedido.crearPedidoCompleto(cedula_usuario, productos, total);
        
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: resultado
        });
        
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al procesar el pedido'
        });
    }
};

const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.obtenerPedidos();
        res.status(200).json({
            success: true,
            data: pedidos
        });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los pedidos'
        });
    }
}

const getPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.obtenerPedido(id);
        res.status(200).json({
            success: true,
            data: pedido
        });
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener el pedido'
        });
    }
}

export default {
    crearPedido,
    getPedidos,
    getPedido
};