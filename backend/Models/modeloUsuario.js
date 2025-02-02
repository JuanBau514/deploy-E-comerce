import db from './conection.js';

class Usuario {
    constructor({ cedula, nombre, apellido, correo, telefono, id_genero = null, id_rol, nit_empresa }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.id_genero = id_genero;
        this.id_rol = id_rol;
        this.nit_empresa = nit_empresa;
    }

    async saveRepresentanteLegal() {
        const query = `
            INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, id_genero, id_rol, nit_empresa)
            VALUES ('${this.cedula}', '${this.nombre}', '${this.apellido}', '${this.correo}', '${this.telefono}', ${this.id_genero || 'NULL'}, ${this.id_rol}, '${this.nit_empresa}')
        `;
        return await db.query(query);
    }

    static async create({ cedula, nombre, apellido, correo, contraseña, id_genero, id_rol }) {
        const query = `
            INSERT INTO usuario (cedula, nombre, apellido, correo, contraseña, id_genero, id_rol) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return db.query(query, [cedula, nombre, apellido, correo, contraseña, id_genero, id_rol]);
    }

    static async findByEmail(correo) {
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        const [rows] = await db.query(query, [correo]);
        return rows.length ? rows[0] : null;
    }

    static async findByCedula(cedula) {
        try {
            console.log('Ejecutando consulta para cédula:', cedula);
            
            const query = 'SELECT * FROM usuario WHERE cedula = ?';
            const [rows] = await db.query(query, [cedula]);
            
            console.log('Resultado de la consulta:', rows);

            if (!rows || rows.length === 0) {
                console.log('No se encontraron resultados');
                return null;
            }

            const userData = rows[0];
            console.log('Usuario encontrado:', userData);
            
            return userData;

        } catch (error) {
            console.error('Error en findByCedula:', error);
            throw new Error(`Error al buscar usuario por cédula: ${error.message}`);
        }
    }

    // Método getAll en el modelo Usuario
    static async getAll() {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.cedula,
                u.nombre,
                u.apellido,
                u.correo,
                g.genero as genero,
                r.rol as rol,
                e.nit as nit_empresa,
                e.razon_social
            FROM usuario u
            LEFT JOIN genero g ON u.id_genero = g.id_genero
            LEFT JOIN rol r ON u.id_rol = r.id_rol
            LEFT JOIN empresa e ON u.nit_empresa = e.nit
        `);
        return rows;
    } catch (error) {
        console.error('Error en Usuario.getAll:', error);
        throw error;
    }
}

    static async delete(cedula) {
        const query = 'DELETE FROM usuario WHERE cedula = ?';
        return db.query(query, cedula);
    }
}

export default Usuario;