import db from './conection.js';

class Indicador {

     static async obtenerTodosIndicadores() {
        const connection = await db.getConnection();
        try {
            // Clientes (usuarios con rol_id != 1)
            const [clientes] = await connection.query(
                'SELECT COUNT(*) as total FROM usuario WHERE rol_id != 1'
            );

            // Administradores (usuarios con rol_id = 1)
            const [admins] = await connection.query(
                'SELECT COUNT(*) as total FROM usuario WHERE rol_id = 1'
            );

            // Productos
            const [productos] = await connection.query(
                'SELECT COUNT(*) as total, SUM(cantidad_disponible) as stock FROM producto'
            );

            // Pedidos
            const [pedidos] = await connection.query(
                'SELECT COUNT(*) as total, SUM(total) as ventas_totales FROM pedido p JOIN factura f ON p.id_pedido = f.id_pedido'
            );

            return {
                success: true,
                data: {
                    clientes: clientes[0].total,
                    administradores: admins[0].total,
                    productos: {
                        total: productos[0].total,
                        stock: productos[0].stock || 0
                    },
                    pedidos: {
                        total: pedidos[0].total,
                        ventas_totales: pedidos[0].ventas_totales || 0
                    }
                }
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async obtenerTotalClientes() {
        try {
            const connection = await db.getConnection();
            const [result] = await connection.query(
                'SELECT COUNT(*) as total FROM usuario WHERE rol_id != 1'
            );
            connection.release();
            return result[0].total;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTotalAdministradores() {
        try {
            const connection = await db.getConnection();
            const [result] = await connection.query(
                'SELECT COUNT(*) as total FROM usuario WHERE rol_id = 1'
            );
            connection.release();
            return result[0].total;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTotalProductos() {
        try {
            const connection = await db.getConnection();
            const [result] = await connection.query(
                'SELECT COUNT(*) as total FROM producto'
            );
            connection.release();
            return result[0].total;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPedidosUltimoMes() {
        try {
            const connection = await db.getConnection();
            const [result] = await connection.query(
                `SELECT COUNT(*) as total FROM pedido 
                 WHERE MONTH(fecha_pedido) = MONTH(CURRENT_DATE()) 
                 AND YEAR(fecha_pedido) = YEAR(CURRENT_DATE())`
            );
            connection.release();
            return result[0].total;
        } catch (error) {
            throw error;
        }
    }

}

export default Indicador;