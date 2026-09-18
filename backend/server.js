const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./db');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

/* =========================
   🔐 REGISTER
========================= */
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(sql, [name, email, hash], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Erro ao cadastrar');
      }

      res.send('Usuário criado com sucesso!');
    });
  } catch (err) {
    res.status(500).send('Erro no servidor');
  }
});

/* =========================
   🔑 LOGIN
========================= */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).send('Senha inválida');
    }

    res.send({
      message: 'Login realizado',
      user: user
    });
  });
});

/* =========================
   🚀 START SERVER
========================= */
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});