import db from './conection.js';

class Rubro {
    constructor(id_rubro, nombre) {
        this.id = id_rubro;
        this.nombre = nombre;
    }

    async save() {
        const query = `INSERT INTO rubro (nombre) VALUES ('${this.nombre}')`;
        return await db.query(query);
    }

    static async getAll() {
        return await db.query('SELECT * FROM rubro');
    }

    async update() {
        const query = `UPDATE rubro SET nombre = '${this.nombre}' WHERE id = ${this.id}`;
        return await db.query(query);
    }

    static async delete(id) {
        return await db.query(`DELETE FROM rubro WHERE id = ${id}`);
    }
}

export default Rubro;