import db from './conection.js';

class Indicador{
    constructor(numeroProductos, numeroClientes, numeroAdministradores,pedidosRealizados){
        this.numeroProductos = numeroProductos;
        this.numeroClientes = numeroClientes;
        this.numeroAdministradores = numeroAdministradores;
        this.pedidosRealizados = pedidosRealizados;
    }

    static realizarConsulta (){
       // const query = 'SELECT COUNT(*) FROM producto';
        const queries =  ['SELECT COUNT(*) FROM producto;',"SELECT COUNT(*) FROM usuario WHERE id_rol = 2;","SELECT COUNT(*) FROM usuario WHERE id_rol=1;","SELECT COUNT(*) FROM factura;"] 

        const resultados = []; //En este objeto, se guardaran los resultados de cada consulta.
        queries.forEach(async (consulta)=>{

            console.log(`Haciendo la consulta: ${consulta}`)
            let resultado = await db.query(`${consulta}`);
            console.log(`Mostrando el resultado ${resultado}`)            
            resultados.push(resultado);
        })

        return resultados;
    }

    static async realizarReporte (mes,annio)
    {
        const consultas = 
        {
            "Cantidad_usuarios": "Select count(*) from usuario",
            "Gente": "SELECT * FROM usuario",
            "cantidad_productos": "Select count(*) from producto",
            "productos": "Select * from producto",
        }

        const resultados = {}

        for( const consulta in consultas){
             resultados.consulta = await db.query(consultas[consulta]);            
        }

        for( const resultado in resultados)
        {
            console.log(`Resultado de la consulta:  ${resultados[resultado]}`)
        }

        return resultados;
    }
    
}
//

export default Indicador


//const informacion = Indicador.realizarConsulta();


