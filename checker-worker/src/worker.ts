import fetch from 'node-fetch';
import pool from './db';

// Usamos uma interface para definir a "forma" de um objeto Endpoint,
// garantindo a tipagem do nosso código.
interface Endpoint {
  id: number;
  name: string;
  url: string;
  user_id: number;
}

// Função para buscar todos os endpoints do banco de dados.
const fetchEndpoints = async (): Promise<Endpoint[]> => {
  try {
    const [rows] = await pool.query('SELECT id, name, url, user_id FROM monitored_endpoints');
    // Fazemos um type assertion para dizer ao TypeScript que o resultado é um array de Endpoints.
    return rows as Endpoint[];
  } catch (error) {
    console.error('[Worker] Error fetching endpoints from DB:', error);
    return []; // Retorna um array vazio em caso de erro para não quebrar o loop.
  }
};

// Função para checar um único endpoint.
const checkEndpoint = async (endpoint: Endpoint): Promise<void> => {
  const startTime = Date.now();
  try {
    const response = await fetch(endpoint.url, { timeout: 10000 }); // Timeout de 10 segundos
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(
      `[Worker] Checked '${endpoint.name}' (${endpoint.url}) | Status: ${response.status} | Response Time: ${responseTime}ms`
    );
    // Futuramente, aqui salvaremos este resultado no banco de dados.

  } catch (error: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.error(
      `[Worker] FAILED to check '${endpoint.name}' (${endpoint.url}) | Error: ${error.message} | Time: ${responseTime}ms`
    );
  }
};

// Função principal que orquestra o trabalho do worker.
const main = async () => {
  console.log('[Worker] Starting check cycle...');
  const endpoints = await fetchEndpoints();

  if (endpoints.length === 0) {
    console.log('[Worker] No endpoints to check. Waiting for next cycle.');
    return;
  }
  
  // Usamos Promise.all para disparar todas as checagens em paralelo,
  // o que é mais eficiente do que checar uma por uma em sequência.
  await Promise.all(endpoints.map(checkEndpoint));
  console.log('[Worker] Check cycle finished.');
};

// --- Loop Principal ---
// Define o intervalo em que o worker vai rodar (a cada 15 segundos para teste).
const CHECK_INTERVAL_MS = 15000; 

console.log(`[Worker] Service started. Checks will run every ${CHECK_INTERVAL_MS / 1000} seconds.`);

// Roda a função main imediatamente na primeira vez...
main();
// ...e depois a cada X segundos.
setInterval(main, CHECK_INTERVAL_MS);