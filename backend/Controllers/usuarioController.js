import Usuario from '../Models/modeloUsuario.js';
import bcrypt from 'bcryptjs';
import db from '../Models/conection.js';
import nodemailer from 'nodemailer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function handleExcel(nickname, lastname, email, rutFile) {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'registro_personas_naturales.xlsx');
    const workbook = fs.existsSync(filePath) ? 
        xlsx.readFile(filePath) : 
        xlsx.utils.book_new();

    const usuarioData = [[
        nickname, 
        lastname, 
        email, 
        rutFile.filename,
        new Date().toISOString()
    ]];

    let usuarioSheet = workbook.Sheets["Personas Naturales"];
    if (!usuarioSheet) {
        usuarioSheet = xlsx.utils.aoa_to_sheet([
            ["Nickname", "Lastname", "Email", "RUT Archivo", "Fecha Registro"]
        ]);
        xlsx.utils.book_append_sheet(workbook, usuarioSheet, "Personas Naturales");
    }
    
    xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
    xlsx.writeFile(workbook, filePath);
}

const getUsuarioByCedula = async (req, res) => {
    try {
        const { cedula } = req.params;

        if (!cedula) {
            console.log('Cédula no proporcionada');
            return res.status(400).json({ 
                success: false,
                message: 'Cédula no proporcionada' 
            });
        }

        if (!/^\d+$/.test(cedula)) {
            console.log('Formato de cédula inválido');
            return res.status(400).json({ 
                success: false,
                message: 'Formato de cédula inválido' 
            });
        }

        console.log(`Buscando usuario con cédula: ${cedula}`);
        const usuario = await Usuario.findByCedula(cedula);

        console.log('Resultado de la búsqueda:', usuario);

        if (!usuario) {
            console.log(`No se encontró usuario con cédula: ${cedula}`);
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        return res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

const createPersonaNatural = async (req, res) => {
    try {
        const { nickname, lastname, email } = req.body;
        const rutFile = req.file;

        if (!nickname || !lastname || !email || !rutFile) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: 'tecnicoinaldulces@gmail.com',
            subject: 'Nuevo Registro de Persona Natural',
            html: `
                <h1>Nuevo Registro de Persona Natural</h1>
                <ul>
                    <li><strong>Nombre:</strong> ${nickname}</li>
                    <li><strong>Apellido:</strong> ${lastname}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Fecha de Registro:</strong> ${new Date().toLocaleString()}</li>
                </ul>
            `,
            attachments: [
                {
                    filename: rutFile.originalname,
                    path: rutFile.path,
                    contentType: rutFile.mimetype
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Registro exitoso. Se ha enviado un correo de confirmación." });

    } catch (error) {
        console.error("Error al enviar correo:", error);
        res.status(500).json({ message: "Error al procesar el registro. Por favor, intente nuevamente." });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa } = req.body;
        const usuario = new Usuario(cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa);
        await usuario.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const getUsuarios = async (req, res) => {
    try {
        console.log('Iniciando obtención de usuarios');
        const usuarios = await Usuario.getAll();
        
        if (!usuarios || usuarios.length === 0) {
            console.log('No se encontraron usuarios');
            return res.status(404).json({
                success: false,
                message: 'No se encontraron usuarios'
            });
        }

        console.log(`Se encontraron ${usuarios.length} usuarios`);
        return res.status(200).json([usuarios]); // Formato específico requerido por el frontend
    } catch (error) {
        console.error('Error en getUsuarios:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuarios',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

// Modificar updateUsuario para usar el nuevo método
const updateUsuario = async (req, res) => {
    try {
        const userData = req.body;
        
        if (!userData.cedula) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cédula es requerida' 
            });
        }

        await Usuario.update(userData);

        res.status(200).json({ 
            success: true,
            message: 'Usuario actualizado con éxito' 
        });

    } catch (error) {
        console.error('Error en updateUsuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.delete(id);
        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);
        if (!user || user.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if (!user[0].contraseña) {
            return res.status(500).json({ message: 'Error del servidor: Contraseña no encontrada' });
        }

        const isMatch = await bcrypt.compare(password, user[0].contraseña);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        return res.status(200).json({ cedula: user[0].cedula, role: user[0].id_rol, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contraseña, id_genero, id_rol } = req.body;

        if (!cedula || !nombre || !apellido || !correo || !contraseña || !id_rol) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los campos son requeridos' 
            });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        await Usuario.create({
            cedula,
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            id_genero,
            id_rol
        });

        res.status(201).json({ 
            success: true, 
            message: 'Usuario creado exitosamente' 
        });

    } catch (error) {
        console.error('Error en createAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

export default {
    getUsuarioByCedula,
    createPersonaNatural,
    createUsuario,
    getUsuarios,
    updateUsuario,
    deleteUsuario,
    login,
    createAdmin
};