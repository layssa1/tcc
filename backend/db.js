const mysql = require('mysql2');

// cria conexão
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'hero_academy'
});

// conecta
db.connect((err) => {
  if (err) {
    console.log('Erro ao conectar:', err);
  } else {
    console.log('Banco conectado com sucesso');
  }
});

module.exports = db;