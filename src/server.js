require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { conectarBanco } = require('./config/database');
const projetoRoutes = require('./routes/projetoRoutes');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.path.includes('//')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }
  return next();
});
app.use('/projetos', projetoRoutes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.code === 11000) return res.status(409).json({ erro: 'Já existe um projeto com este código' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err instanceof SyntaxError) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }
  return res.status(500).json({ erro: 'Erro interno do servidor' });
});

async function iniciarServidor() {
  const porta = Number(process.env.PORT) || 3000;
  try {
    if (!process.env.MONGO_URI) throw new Error('A variável MONGO_URI não foi definida');
    await conectarBanco(process.env.MONGO_URI);
    app.listen(porta, () => console.log(`API disponível em http://localhost:${porta}`));
  } catch (err) {
    console.error('Não foi possível iniciar a API:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
}

iniciarServidor();
