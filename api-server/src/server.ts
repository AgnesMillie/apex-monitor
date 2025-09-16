import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from './db';
import authRoutes from './api/auth/auth.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const setupDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Checking database schema...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "users" is ready.');
    connection.release();
  } catch (error) {
    console.error('Failed to set up database schema:', error);
    process.exit(1);
  }
};

// A linha abaixo é a que foi corrigida
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, async () => {
  console.log(`API Server is listening on port ${PORT}`);
  await setupDatabase();
});