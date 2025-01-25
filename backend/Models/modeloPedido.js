import db from './conection.js';

class Pedido {
    constructor(id_pedido, id_usuario, cedula_usuario) {
        this.id_pedido = id_pedido;
        this.id_usuario = id_usuario;
        this.cedula_usuario = cedula_usuario;
    }

    static async create({ id_pedido, id_usuario, cedula_usuario }) {
        const query = 'INSERT INTO pedido (id_pedido, id_usuario, cedula_usuario) VALUES (?, ?, ?)';
        return db.query(query, [id_pedido, id_usuario, cedula_usuario]);
    }

    static async findById(id_pedido) {
        const query = 'SELECT * FROM pedido WHERE id_pedido = ?';
        const [rows] = await db.query(query, [id_pedido]);
        return rows.length ? rows[0] : null;
    }

    static async delete(id_pedido) {
        const query = 'DELETE FROM pedido WHERE id_pedido = ?';
        return db.query(query, [id_pedido]);
    }

    static async update({ id_pedido, id_usuario, cedula_usuario }) {
        const query = 'UPDATE pedido SET id_usuario = ?, cedula_usuario = ? WHERE id_pedido = ?';
        return db.query(query, [id_usuario, cedula_usuario, id_pedido]);
    }

    static async getAll() {
        const query = 'SELECT * FROM pedido';
        return db.query(query);
    }
}

export default Pedido;