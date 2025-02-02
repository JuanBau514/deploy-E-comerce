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
        try {
            const query = 'SELECT * FROM rubro ORDER BY id_rubro';
            const [rubros] = await db.query(query);
            return rubros;
        } catch (error) {
            console.error('Error en getAll rubros:', error);
            throw error;
        }
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