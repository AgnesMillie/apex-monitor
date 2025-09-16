import mysql from 'mysql2/promise';

// Cria o 'pool' de conexões.
// As informações de conexão são lidas diretamente das variáveis de ambiente
// que o Docker Compose injetou no contêiner do api-server.
const pool = mysql.createPool({
  host: process.env.DB_HOST,          // O nome do serviço do banco de dados no docker-compose.yml ('db')
  user: process.env.DB_USER,          // O usuário que definimos no .env
  password: process.env.DB_PASSWORD,  // A senha que definimos no .env
  database: process.env.DB_NAME,      // O nome do banco de dados do .env
  waitForConnections: true,           // Espera por uma conexão se todas estiverem em uso
  connectionLimit: 10,                // Número máximo de conexões no pool
  queueLimit: 0                       // Fila ilimitada de solicitações de conexão
});

// Mensagem de log para confirmar que o pool foi criado (mas não necessariamente conectado ainda)
console.log('MySQL Connection Pool created.');

// Exporta o pool para que outras partes da nossa aplicação possam usá-lo para fazer consultas
export default pool;