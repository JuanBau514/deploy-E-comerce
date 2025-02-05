import Empresa from '../Models/modeloEmpresa.js';
import db from '../Models/conection.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const enviarCorreo = async (req, res) => {
    const { razon_social, nit, telefono_empresa, correo, id_rubro, representante } = req.body;

    // Configuración del transportador de email
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: 'tecnicoinaldulces@gmail.com',
        subject: 'Datos de Registro de Empresa',
        html: `
            <h1>Datos de Registro de Empresa</h1>
            <ul>
                <li><strong>Razón Social:</strong> ${razon_social}</li>
                <li><strong>NIT:</strong> ${nit}</li>
                <li><strong>Teléfono:</strong> ${telefono_empresa}</li>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Rubro:</strong> ${id_rubro}</li>
                <li><strong>Representante:</strong> ${representante.nombre} ${representante.apellido}</li>
                <li><strong>Cédula Representante:</strong> ${representante.cedula}</li>
            </ul>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Datos enviados por correo con éxito." });
    } catch (error) {
        console.error("Error al enviar correo:", error);
        res.status(500).json({ message: "Error al enviar el correo." });
    }
};

const registerEmpresa = async (req, res) => {
    console.log('Datos de registro:', req.body);
    const { razon_social, nit, id_rubro, correo, telefono_empresa, representante } = req.body;

    const telefono = telefono_empresa ? telefono_empresa : null;

    // Validación inicial de datos
    if (!correo) {
        return res.status(400).json({ 
            status: 'error',
            type: 'VALIDATION_ERROR',
            message: "El correo es obligatorio." 
        });
    }

    let connection; // Declarar la conexión aquí

    try {
        // Verificar si el correo ya existe en la base de datos
        const checkEmailQuery = `
            SELECT correo FROM usuario WHERE correo = ?
            UNION
            SELECT correo FROM empresa WHERE correo = ?
        `;
        const [existingEmail] = await db.query(checkEmailQuery, [correo, correo]);
        
        if (existingEmail.length > 0) {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_EMAIL',
                message: "El correo electrónico ya está registrado."
            });
        }

        // Verificar si el NIT ya existe
        const [existingNIT] = await db.query('SELECT nit FROM empresa WHERE nit = ?', [nit]);
        if (existingNIT.length > 0) {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_NIT',
                message: "El NIT ya está registrado en el sistema."
            });
        }

        // Configuración del transportador de email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verificar la configuración del email
        try {
            await transporter.verify();
        } catch (emailError) {
            console.error("Error al verificar la configuración del email:", emailError);
            return res.status(500).json({
                status: 'error',
                type: 'EMAIL_CONFIG_ERROR',
                message: "Error en la configuración del servidor de correo."
            });
        }

        // Iniciar transacción
        connection = await db.getConnection(); // Obtén una conexión
        await connection.beginTransaction(); // Inicia la transacción

        try {
            // Insertar usuario
            const usuarioQuery = `
                INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, id_rol)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const usuarioValues = [
                representante.cedula,
                representante.nombre,
                representante.apellido,
                correo, 
                telefono,
                3,
            ];

            await connection.query(usuarioQuery, usuarioValues);

            // Insertar empresa
            const empresaQuery = `
                INSERT INTO empresa (razon_social, nit, telefono, correo, id_rubro, cedula_representante_legal)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const empresaValues = [
                razon_social,
                nit,
                telefono,
                correo, 
                id_rubro,
                representante.cedula
            ];

            await connection.query(empresaQuery, empresaValues);

            // Guardar los datos en el archivo Excel
            const filePath = path.join(__dirname, '..', 'registro_empresas.xlsx');
            const workbook = fs.existsSync(filePath) ? xlsx.readFile(filePath) : xlsx.utils.book_new();

            const usuarioData = [
                [representante.cedula, representante.nombre, representante.apellido, correo, telefono]
            ];
            let usuarioSheet = workbook.Sheets["Usuarios"];
            if (!usuarioSheet) {
                usuarioSheet = xlsx.utils.aoa_to_sheet([["Cédula", "Nombre", "Apellido", "Correo", "Teléfono"]]);
                xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
                xlsx.utils.book_append_sheet(workbook, usuarioSheet, "Usuarios");
            } else {
                xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
            }

            const empresaData = [
                [razon_social, nit, telefono, correo, id_rubro, representante.cedula]
            ];
            let empresaSheet = workbook.Sheets["Empresas"];
            if (!empresaSheet) {
                empresaSheet = xlsx.utils.aoa_to_sheet([["Razón Social", "NIT", "Teléfono", "Correo", "ID Rubro", "Cédula Representante"]]);
                xlsx.utils.sheet_add_aoa(empresaSheet, empresaData, { origin: -1 });
                xlsx.utils.book_append_sheet(workbook, empresaSheet, "Empresas");
            } else {
                xlsx.utils.sheet_add_aoa(empresaSheet, empresaData, { origin: -1 });
            }

            xlsx.writeFile(workbook, filePath);
             // Enviar correo
            const mailOptions = {
                from: `"Tu Empresa" <${process.env.EMAIL}>`,
                to: correo,
                subject: 'Registro de Empresa Exitoso',
                html: `
                    <h1>¡Registro Exitoso!</h1>
                    <p>Hola ${representante.nombre},</p>
                    <p>La empresa ${razon_social} ha sido registrada exitosamente.</p>
                    <h2>Información del registro:</h2>
                    <ul>
                        <li><strong>Razón Social:</strong> ${razon_social}</li>
                        <li><strong>NIT:</strong> ${nit}</li>
                        <li><strong>Teléfono:</strong> ${telefono}</li>
                        <li><strong>Correo:</strong> ${correo}</li>
                        <li><strong>Representante Legal:</strong> ${representante.nombre} ${representante.apellido}</li>
                        <li><strong>Cédula Representante:</strong> ${representante.cedula}</li>
                    </ul>
                    <p>¡Gracias por registrarte!</p>
                `
            };

            await transporter.sendMail(mailOptions);
            await connection.commit(); // Usar connection.commit()
            return res.status(201).json({
                status: 'success',
                message: "Empresa registrada con éxito y correo enviado correctamente."
            });

        } catch (innerError) {
            await connection.rollback(); // Usar connection.rollback()
            throw innerError;
        }

    } catch (error) {
        console.error("Error detallado:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_ENTRY',
                message: "Ya existe un registro con estos datos."
            });
        }

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                type: 'EMAIL_SERVICE_ERROR',
                message: "Error al conectar con el servidor de correo."
            });
        }

        return res.status(500).json({
            status: 'error',
            type: 'SERVER_ERROR',
            message: "Error en el servidor al procesar la solicitud.",
            detail: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) connection.release(); // Asegúrate de liberar la conexión
    }
};

const getEmpresas = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            SELECT e.*, u.nombre as nombre_representante, u.apellido as apellido_representante, r.rubro as rubro
            FROM empresa e 
            LEFT JOIN usuario u ON e.cedula_representante_legal = u.cedula
            LEFT JOIN rubro r ON e.id_rubro = r.id_rubro
        `;
        const [empresas] = await connection.query(query);
        
        if (!empresas || empresas.length === 0) {
            return res.status(200).json({ 
                status: 'success',
                data: [],
                message: 'No hay empresas registradas'
            });
        }

        res.status(200).json({
            status: 'success',
            data: empresas,
            message: 'Empresas recuperadas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las empresas',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Crear empresa
const createEmpresa = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { nit, razon_social, correo, telefono, id_rubro, representante } = req.body;
        const defaultPassword = '12345'; // Contraseña por defecto

        // Validar id_rubro
        const [rubroExiste] = await connection.query(
            'SELECT id_rubro FROM rubro WHERE id_rubro = ?',
            [id_rubro]
        );

        if (!rubroExiste.length) {
            throw new Error('El rubro seleccionado no existe');
        }

        // Validar datos requeridos
        if (!nit || !razon_social || !correo || !id_rubro || !representante) {
            throw new Error('Faltan datos requeridos');
        }

        // Insertar usuario con contraseña por defecto
        await connection.query(
            'INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, contraseña, id_rol) VALUES (?, ?, ?, ?, ?, ?, 3)',
            [representante.cedula, representante.nombre, representante.apellido, correo, telefono, defaultPassword]
        );

        // Insertar empresa
        await connection.query(
            'INSERT INTO empresa (nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal) VALUES (?, ?, ?, ?, ?, ?)',
            [nit, razon_social, correo, telefono, id_rubro, representante.cedula]
        );

        // Configurar envío de correo
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Enviar correo con credenciales
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: correo,
            subject: 'Registro Exitoso - Cambio de Contraseña Requerido',
            html: `
                <h1>Bienvenido a nuestra plataforma</h1>
                <p>Su empresa ha sido registrada exitosamente.</p>
                <p>Sus credenciales de acceso son:</p>
                <ul>
                    <li>Usuario: ${correo}</li>
                    <li>Contraseña temporal: ${defaultPassword}</li>
                </ul>
                <p><strong>Por seguridad, por favor ingrese al sistema y cambie su contraseña inmediatamente.</strong></p>
            `
        });

        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Empresa registrada con éxito. Se ha enviado un correo con las credenciales.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error en createEmpresa:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al registrar empresa'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Actualizar empresa
const updateEmpresa = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const { nit } = req.params;
        const { razon_social, correo, telefono, id_rubro, cedula_representante_legal } = req.body;

        // Verificar si el usuario (representante legal) existe
        const [usuario] = await connection.query(
            'SELECT cedula FROM usuario WHERE cedula = ?',
            [cedula_representante_legal]
        );

        if (usuario.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'El representante legal no está registrado como usuario'
            });
        }

        // Actualizar empresa
        await connection.query(
            `UPDATE empresa
             SET razon_social = ?, correo = ?, telefono = ?, 
                 id_rubro = ?, cedula_representante_legal = ?
             WHERE nit = ?`,
            [razon_social, correo, telefono, id_rubro, cedula_representante_legal, nit]
        );

        res.status(200).json({
            status: 'success',
            message: 'Empresa actualizada correctamente'
        });

    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la empresa',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

const deleteEmpresa = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Eliminar los usuarios asociados a la empresa
        const deleteUserQuery = 'DELETE FROM usuario WHERE nit_empresa = ?';
        await connection.query(deleteUserQuery, [id]);

        // Eliminar la empresa
        const deleteEmpresaQuery = 'DELETE FROM empresa WHERE nit = ?';
        const [result] = await connection.query(deleteEmpresaQuery, [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        await connection.commit();
        res.status(200).json({ message: 'Empresa eliminada con éxito' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al eliminar empresa:', error);
        res.status(500).json({ error: 'Error al eliminar empresa' });
    } finally {
        if (connection) connection.release();
    }
};


export default {
    enviarCorreo,
    registerEmpresa,
    getEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa
};