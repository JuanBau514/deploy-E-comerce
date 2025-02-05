import Indicador from '../Models/modeloIndicador.js';

const obtenerIndicadores = async (req, res) => {
    try {
        const resultado = await Indicador.obtenerTodosIndicadores();
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener indicadores:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener indicadores' 
        });
    }
};

const obtenerTotalPedidos = async (req, res) => {
    try {
        const resultado = await Indicador.obtenerPedidosUltimoMes();
        res.status(200).json({
            success: true,
            total: resultado
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener total de pedidos' 
        });
    }
};

const obtenerTotalClientes = async (req, res) => {
    try {
        const resultado = await Indicador.obtenerTotalClientes();
        res.status(200).json({
            success: true,
            total: resultado
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener total de clientes' 
        });
    }
};

const obtenerTotalAdministradores = async (req, res) => {
    try {
        const resultado = await Indicador.obtenerTotalAdministradores();
        res.status(200).json({
            success: true,
            total: resultado
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener total de administradores' 
        });
    }
};

const obtenerTotalProductos = async (req, res) => {
    try {
        const resultado = await Indicador.obtenerTotalProductos();
        res.status(200).json({
            success: true,
            total: resultado
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener total de productos' 
        });
    }
};

export default {
    obtenerIndicadores,
    obtenerTotalPedidos,
    obtenerTotalClientes,
    obtenerTotalAdministradores,
    obtenerTotalProductos
};