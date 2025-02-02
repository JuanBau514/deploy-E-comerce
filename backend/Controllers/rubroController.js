import Rubro from '../Models/modeloRubro.js';

const getRubros = async (req, res) => {
    try {
        const rubros = await Rubro.getAll();
        return res.status(200).json({
            success: true,
            data: rubros
        });
    } catch (error) {
        console.error('Error en getRubros:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener rubros',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

export default {
    getRubros
};