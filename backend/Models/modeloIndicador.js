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
        const queries [ 
            "producto": 'SELECT COUNT(*) FROM producto;',
            "cliente": "SELECT COUNT(*) FROM usuario WHERE id_rol = 2;",
            "administrador": "SELECT COUNT(*) FROM usuario WHERE id_rol=1",
            "pedido": "SELECT COUNT(*) FROM factura;"
        ]
        for (const consulta of queries) {
             const resultado await db.query(consulta)
            resultados.push(resultado)
        }
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
//export.default Indicador;
export default Indicador
