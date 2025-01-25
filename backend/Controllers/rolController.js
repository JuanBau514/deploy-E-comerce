import Rol from '../Models/modeloRol.js';

const getRoles = async (req, res) => {
    try {
        const roles = await Rol.getAll();
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener roles',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

export default { getRoles };