import db from './conection.js';

class Factura {
    constructor(id_factura, fecha, iva, total, id_pedido) {
        this.id_factura = id_factura;
        this.fecha = fecha;
        this.iva = iva;
        this.total = total;
        this.id_pedido = id_pedido;
    }

    static async create({ id_factura, fecha, iva, total, id_pedido }) {
        const query = 'INSERT INTO factura (id_factura, fecha, iva, total, id_pedido) VALUES (?, ?, ?, ?, ?)';
        return db.query(query, [id_factura, fecha, iva, total, id_pedido]);
    }

    static async findById(id_factura) {
        const query = 'SELECT * FROM factura WHERE id_factura = ?';
        const [rows] = await db.query(query, [id_factura]);
        return rows.length ? rows[0] : null;
    }

    static async delete(id_factura) {
        const query = 'DELETE FROM factura WHERE id_factura = ?';
        return db.query(query, [id_factura]);
    }

    static async update({ id_factura, fecha, iva, total, id_pedido }) {
        const query = 'UPDATE factura SET fecha = ?, iva = ?, total = ?, id_pedido = ? WHERE id_factura = ?';
        return db.query(query, [fecha, iva, total, id_pedido, id_factura]);
    }

    static async getAll() {
        const query = 'SELECT * FROM factura';
        return db.query(query);
    }
}

export default Factura;