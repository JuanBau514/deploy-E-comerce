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
        const consulta_producto = "SELECT COUNT(*) FROM producto;"
        const consulta_cliente = "SELECT COUNT(*) FROM usuario WHERE id_rol = 2;"
        const consulta_administrador = "SELECT COUNT(*) FROM usuario WHERE id_rol=1;"
        const consulta_pedido = "SELECT COUNT(*) FROM factura;"

        const rere = await db.query(consulta_producto);
        resultados.push(rere)

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
