import mysql from 'mysql2/promise';

// Cria o pool de conexões para o worker.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // O worker pode usar menos conexões que a API
  queueLimit: 0
});

console.log('[Worker] MySQL Connection Pool created.');

export default pool;