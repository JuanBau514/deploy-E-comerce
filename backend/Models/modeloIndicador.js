import db from './conection.js';


class Indicador{
    constructor(numeroProductos, numeroClientes, numeroAdministradores,pedidosRealizados){
        this.numeroProductos = numeroProductos;
        this.numeroClientes = numeroClientes;
        this.numeroAdministradores = numeroAdministradores;
        this.pedidosRealizados = pedidosRealizados;
    }

    static async realizarConsulta (){
       // const query = 'SELECT COUNT(*) FROM producto';
        const queries =  ['SELECT COUNT(*) FROM producto;',
                          "SELECT COUNT(*) FROM usuario WHERE id_rol = 2;",
                          "SELECT COUNT(*) FROM usuario WHERE id_rol=1;",
                          "SELECT COUNT(*) FROM factura;"
                         ] 
         //En este objeto, se guardaran los resultados de cada consulta.
        try{
           const resultados = await Promise.all(queries.map(query => db.query(query)));
        }catch(error){
            console.log(error);
        }
        return resultados;
    }

async function executeQueriesParallel() {
    const queries = [
        "INSERT INTO table_name (column) VALUES ('value1')",
        "UPDATE table_name SET column = 'value2' WHERE id = 1",
        "DELETE FROM table_name WHERE id = 2"
    ];

    try {
        await Promise.all(queries.map(query => pool.query(query)));
        console.log('All queries executed in parallel.');
    } catch (err) {
        console.error('Error executing queries:', err);
    }
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
//export.default Indicador;
//export default Indicador


const informacion = Indicador.realizarConsulta();


