import Rubro from '../Models/modeloRubro.js';

const getRubros = async (req, res) => {
    try {
        console.log('Obteniendo rubros...');
        const rubros = await Rubro.getAll();
        
        if (!rubros || rubros.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron rubros'
            });
        }

        console.log('Rubros encontrados:', rubros);
        return res.status(200).json({
            success: true,
            data: rubros
        });
    } catch (error) {
        console.error('Error en getRubros:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener rubros'
        });
    }
};

export default { getRubros };