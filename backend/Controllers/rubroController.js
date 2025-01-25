import Rubro from '../Models/modeloRubro.js';

const getRubros = async (req, res) => {
    try {
        const rubros = await Rubro.getAll();
        res.status(200).json(rubros);
    } catch (error) {
        console.error('Error al obtener rubros:', error);
        res.status(500).json({ message: 'Error al obtener rubros' });
    }
};

export default { getRubros };