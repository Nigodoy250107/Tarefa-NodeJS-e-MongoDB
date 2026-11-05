const Projeto = require('../models/Projeto');

function campoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function erro(res, status, mensagem) {
  return res.status(status).json({ erro: mensagem });
}

function regexLiteral(valor) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listarProjetos(req, res, next) {
  try {
    const filtro = {};
    if (typeof req.query.nome === 'string' && req.query.nome.trim()) {
      filtro.nome = { $regex: regexLiteral(req.query.nome.trim()), $options: 'i' };
    }
    if (typeof req.query.tarefa === 'string' && req.query.tarefa.trim()) {
      filtro['tarefas.codigo'] = req.query.tarefa.trim();
    }
    const projetos = await Projeto.find(filtro).sort({ codigo: 1 });
    return res.status(200).json(projetos);
  } catch (err) { return next(err); }
}

async function buscarProjeto(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    return res.status(200).json(projeto);
  } catch (err) { return next(err); }
}

async function listarTarefas(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    return res.status(200).json(projeto.tarefas);
  } catch (err) { return next(err); }
}

async function criarProjeto(req, res, next) {
  try {
    const { codigo, nome } = req.body || {};
    if (!campoValido(codigo) || !campoValido(nome)) {
      return erro(res, 400, 'Código e nome do projeto são obrigatórios');
    }
    const projeto = new Projeto({ codigo: codigo.trim(), nome: nome.trim(), tarefas: [] });
    await projeto.save();
    return res.status(201).json(projeto);
  } catch (err) { return next(err); }
}

async function atualizarProjeto(req, res, next) {
  try {
    const { nome } = req.body || {};
    if (!campoValido(nome)) return erro(res, 400, 'Nome do projeto é obrigatório');
    const projeto = await Projeto.findOneAndUpdate(
      { codigo: req.params.codigo }, { $set: { nome: nome.trim() } },
      { new: true, runValidators: true }
    );
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    return res.status(200).json(projeto);
  } catch (err) { return next(err); }
}

async function excluirProjeto(req, res, next) {
  try {
    const projeto = await Projeto.findOneAndDelete({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    return res.status(204).end();
  } catch (err) { return next(err); }
}

async function criarTarefa(req, res, next) {
  try {
    const { codigo, nome, responsavel } = req.body || {};
    if (![codigo, nome, responsavel].every(campoValido)) {
      return erro(res, 400, 'Código, nome e responsável da tarefa são obrigatórios');
    }
    const codigoTarefa = codigo.trim();
    const novaTarefa = {
      codigo: codigoTarefa,
      nome: nome.trim(),
      responsavel: responsavel.trim()
    };
    const resultado = await Projeto.updateOne(
      { codigo: req.params.codigo, 'tarefas.codigo': { $ne: codigoTarefa } },
      { $push: { tarefas: novaTarefa } },
      { runValidators: true }
    );
    if (resultado.matchedCount === 0) {
      const projetoExiste = await Projeto.exists({ codigo: req.params.codigo });
      if (!projetoExiste) return erro(res, 404, 'Projeto não encontrado');
      return erro(res, 409, 'Já existe uma tarefa com este código no projeto');
    }
    return res.status(201).json(novaTarefa);
  } catch (err) { return next(err); }
}

async function atualizarTarefa(req, res, next) {
  try {
    const { nome, responsavel } = req.body || {};
    if (![nome, responsavel].every(campoValido)) {
      return erro(res, 400, 'Nome e responsável da tarefa são obrigatórios');
    }
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    const tarefa = projeto.tarefas.find((item) => item.codigo === req.params.codigoTarefa);
    if (!tarefa) return erro(res, 404, 'Tarefa não encontrada');
    tarefa.nome = nome.trim();
    tarefa.responsavel = responsavel.trim();
    await projeto.save();
    return res.status(200).json(tarefa);
  } catch (err) { return next(err); }
}

async function excluirTarefa(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    const indice = projeto.tarefas.findIndex((item) => item.codigo === req.params.codigoTarefa);
    if (indice === -1) return erro(res, 404, 'Tarefa não encontrada');
    projeto.tarefas.splice(indice, 1);
    await projeto.save();
    return res.status(204).end();
  } catch (err) { return next(err); }
}

async function resumoProjeto(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return erro(res, 404, 'Projeto não encontrado');
    const responsaveis = [...new Set(projeto.tarefas.map((tarefa) => tarefa.responsavel))];
    return res.status(200).json({
      codigo: projeto.codigo,
      nome: projeto.nome,
      totalTarefas: projeto.tarefas.length,
      responsaveis
    });
  } catch (err) { return next(err); }
}

module.exports = {
  listarProjetos, buscarProjeto, listarTarefas, criarProjeto, atualizarProjeto,
  excluirProjeto, criarTarefa, atualizarTarefa, excluirTarefa, resumoProjeto
};
