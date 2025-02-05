import db from './conection.js';

class Pedido {
    static async crearPedidoCompleto(cedula_usuario, productos, total) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Verificar que todos los productos existen antes de crear el pedido
            for (const producto of productos) {
                const [productExists] = await connection.query(
                    'SELECT codigo_producto FROM producto WHERE codigo_producto = ?',
                    [producto.id]
                );
                
                if (productExists.length === 0) {
                    throw new Error(`El producto con código ${producto.id} no existe`);
                }
            }

            // Crear pedido
            const [resultPedido] = await connection.query(
                'INSERT INTO pedido (cedula_usuario) VALUES (?)',
                [cedula_usuario]
            );
            
            const id_pedido = resultPedido.insertId;
            
            // Crear registros pedido_producto
            for (const producto of productos) {
                try {
                    const precioTotal = parseFloat((producto.price * producto.quantity).toFixed(2));
                    await connection.query(
                        'INSERT INTO pedido_producto (id_pedido, codigo_producto, cantidad, precio_total_por_producto) VALUES (?, ?, ?, ?)',
                        [id_pedido, producto.id, producto.quantity, precioTotal]
                    );
                } catch (error) {
                    throw new Error(`Error al insertar producto ${producto.id}: ${error.message}`);
                }
            }
            
            // Crear factura
            const fecha = new Date();
            const iva = parseFloat((total * 0.19).toFixed(2));
            const totalRedondeado = parseFloat(total.toFixed(2));
            
            await connection.query(
                'INSERT INTO factura (fecha, iva, total, id_pedido) VALUES (?, ?, ?, ?)',
                [fecha, iva, totalRedondeado, id_pedido]
            );
            
            await connection.commit();
            return { 
                id_pedido,
                iva,
                total: totalRedondeado
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async obtenerPedidos() {
        const connection = await db.getConnection();
        
        try {
            const [pedidos] = await connection.query(
                'SELECT * FROM pedido'
            );
            
            return pedidos;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async obtenerPedido(id) {
        const connection = await db.getConnection();
        
        try {
            const [pedido] = await connection.query(
                'SELECT * FROM pedido WHERE id_pedido = ?',
                [id]
            );
            
            return pedido;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default Pedido;