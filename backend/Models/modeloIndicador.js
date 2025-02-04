import db from './conection.js';


class Indicador{
    static async realizarConsulta (consulta){
        return await db.query(consulta);
    }    
}
//
//export.default Indicador;
export default Indicador
