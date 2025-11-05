const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Ej: 'localhost'
  user: process.env.DB_USER || 'root',     // Ej: 'root'
  password: process.env.DB_PASSWORD || '', // Reemplaza con tu contraseña
  database: process.env.DB_NAME || 'huella_de_carbono',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;


