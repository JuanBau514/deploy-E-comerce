import db from './conection.js';

class Empresa {
    constructor(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal) {
        this.nit = nit;
        this.razon_social = razon_social;
        this.correo = correo;
        this.telefono = telefono;
        this.id_rubro = id_rubro;
        this.cedula_representante_legal = cedula_representante_legal;
    }

    async save() {
        const query = `
            INSERT INTO empresa (nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return await db.query(query, [this.nit, this.razon_social, this.correo, this.telefono, this.id_rubro, this.cedula_representante_legal]);
    }
}

export default Empresa;