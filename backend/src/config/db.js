import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração flexível: suporta DATABASE_URL ou variáveis individuais (DB_HOST, DB_USER...)
// e ativação de SSL para provedores de nuvem (Aiven, TiDB, PlanetScale, Railway, AWS RDS)
const sslConfig = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : undefined;

const poolConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      dateStrings: true,
      ssl: sslConfig
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'reservalab',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      dateStrings: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    };

export const pool = mysql.createPool(poolConfig);

/**
 * Testa a conexão com o banco de dados MySQL
 */
export async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL] Conexão com o banco estabelecida com sucesso!');
    connection.release();
    return { ok: true };
  } catch (erro) {
    console.error('❌ [MySQL] Erro ao conectar ao banco de dados:', erro.message);
    console.error('⚠️  Certifique-se de configurar as variáveis de ambiente no Vercel (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME ou DATABASE_URL).');
    return { ok: false, erro: erro.message };
  }
}

export default pool;
