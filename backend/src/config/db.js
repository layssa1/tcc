import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
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
  dateStrings: true
});

/**
 * Testa a conexão com o banco de dados MySQL
 */
export async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL] Conexão com o banco "reservalab" estabelecida com sucesso!');
    connection.release();
    return { ok: true };
  } catch (erro) {
    console.error('❌ [MySQL] Erro ao conectar ao banco de dados:', erro.message);
    console.error('⚠️  Certifique-se de que o MySQL está rodando e as variáveis no arquivo .env estão corretas.');
    return { ok: false, erro: erro.message };
  }
}

export default pool;
