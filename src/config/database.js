const mongoose = require('mongoose');
const Projeto = require('../models/Projeto');

const projetosIniciais = [
  {
    codigo: 'PRJ001', nome: 'Desenvolvimento de Site',
    tarefas: [
      { codigo: 'TAR101', nome: 'Criar layout', responsavel: 'Ana' },
      { codigo: 'TAR102', nome: 'Desenvolver API', responsavel: 'Carlos' }
    ]
  },
  {
    codigo: 'PRJ002', nome: 'Aplicativo de Vendas',
    tarefas: [
      { codigo: 'TAR201', nome: 'Desenhar telas', responsavel: 'Beatriz' },
      { codigo: 'TAR202', nome: 'Implementar carrinho', responsavel: 'Carlos' }
    ]
  },
  {
    codigo: 'PRJ003', nome: 'Portal de Atendimento',
    tarefas: [
      { codigo: 'TAR301', nome: 'Mapear atendimento', responsavel: 'Diego' },
      { codigo: 'TAR302', nome: 'Criar painel', responsavel: 'Ana' }
    ]
  }
];

async function conectarBanco(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  
  await Projeto.init();
  const projetosExistentes = await Projeto.exists({});
  if (!projetosExistentes) {
    await Projeto.insertMany(projetosIniciais);
    console.log('Projetos iniciais inseridos.');
  }
  console.log('Conectado ao MongoDB.');
}

module.exports = { conectarBanco };
