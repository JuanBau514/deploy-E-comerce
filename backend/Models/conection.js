import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
     host: process.env.DB_HOST || 'viaduct.proxy.rlwy.net',
    port: process.env.DB_PORT || 40146,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'SLuDXdIWNCjQCJQbVCidWLnkJeRtDMwo',
    database: process.env.DB_NAME || 'inaldulces',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
     multipleStatements: true,
    connectTimeout: 10000 // 10 segundo
});

const db = pool.promise();

export default db;
