import  Indicador from '../Models/modeloIndicador.js';

async function obtenerInformacion (req,res) {
    try {
        const resultado = await Indicador.realizarConsulta();    
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




