import  Indicador from '../Models/modeloIndicador.js';

async function obtenerInformacion (req,res) {
    const queries =  ['SELECT COUNT(*) FROM producto;',"SELECT COUNT(*) FROM usuario WHERE id_rol = 2;","SELECT COUNT(*) FROM usuario WHERE id_rol=1;","SELECT COUNT(*) FROM factura;"] 
    try {
        const resultado = await Indicador.realizarConsulta('SELECT * FROM producto;');
        console.log(resultado)
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:`Error al realizar las queries ${error}` });
    }

}

const obtenerReporte = async (req,res)=>{
  const {mes,annio} = req.body;
  try{
    const resultado = await Indicador.realizarReporte(mes,annio);
    console.log(resultado)
    res.status(200).json(resultado);
  }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error al realizar el reporte' });
  }
       
}

export default {
    obtenerInformacion,
    obtenerReporte
}




