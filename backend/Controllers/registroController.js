import Usuario from '../Models/modeloUsuario.js';
import Empresa from '../Models/modeloEmpresa.js';
import xlsx from 'xlsx';
import fs from 'fs';

// Controlador para registrar usuarios (persona natural o empresa)
const registerUser = async (req, res) => {
    console.log('Datos de registro:', req.body);
    const { tipoUsuario, nickname, lastname, email, password, razon_social, nit, telefono_empresa, correo_empresa, representante, cedula_representante, usuario_nuevo, rol_usuario, id_genero, id_rol } = req.body;

    try {
        if (tipoUsuario === 'Persona Natural') {
            // Guardar en un archivo Excel
            const data = [{ nickname, lastname, email, id_genero }];
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Personas Naturales');

            if (!fs.existsSync('./validation_data.xlsx')) {
                xlsx.writeFile(workbook, './validation_data.xlsx');
            } else {
                const file = xlsx.readFile('./validation_data.xlsx');
                xlsx.utils.book_append_sheet(file, worksheet, 'Personas Naturales');
                xlsx.writeFile(file, './validation_data.xlsx');
            }
            res.status(201).send('Registro de persona natural guardado para validación');
        } else if (tipoUsuario === 'Empresa') {
            // Registro de empresas en la base de datos
            const newUser = {
                cedula: nit,
                nombre: representante,
                apellido: '',
                correo: correo_empresa,
                contraseña: password,
                id_genero: 1, // O puedes modificarlo según lo requieras
                id_rol: id_rol || 2 // Rol de empresa
            };

            await Usuario.create(newUser);

            res.status(201).send('Empresa registrada exitosamente');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el registro');
    }
};

// Otros métodos como getAllUsers, deleteUser, etc.

export default { registerUser };