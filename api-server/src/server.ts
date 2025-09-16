import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from './db';

// Importa os módulos de rota
import authRoutes from './api/auth/auth.routes';
import endpointRoutes from './api/endpoints/endpoints.routes';

// Configura as variáveis de ambiente a partir do arquivo .env
dotenv.config();

// Inicializa a aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Função assíncrona para configurar o banco de dados na inicialização
const setupDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Checking database schema...');

    // Cria a tabela 'users' se ela ainda não existir.
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
    
    // Cria a tabela 'monitored_endpoints' se ela não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS monitored_endpoints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(2048) NOT NULL,
        protocol VARCHAR(10) NOT NULL,
        check_interval_seconds INT DEFAULT 300,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Table "monitored_endpoints" is ready.');


    // Libera a conexão de volta para o pool
    connection.release();
  } catch (error) {
    console.error('Failed to set up database schema:', error);
    // Encerra a aplicação se houver um erro crítico na configuração do banco
    process.exit(1);
  }
};

// --- ROTAS DA APLICAÇÃO ---

// Rota de "health check" para verificar se a API está no ar
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Agrupa todas as rotas de autenticação sob o prefixo '/api/auth'
app.use('/api/auth', authRoutes);

// Agrupa todas as rotas de endpoints sob o prefixo '/api/endpoints'
app.use('/api/endpoints', endpointRoutes);


// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, async () => {
  console.log(`API Server is listening on port ${PORT}`);
  // Garante que o banco de dados esteja configurado antes do servidor estar pronto
  await setupDatabase();
});