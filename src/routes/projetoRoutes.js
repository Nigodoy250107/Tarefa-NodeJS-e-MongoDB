const express = require('express');
const controller = require('../controllers/projetoController');

const router = express.Router();

router.get('/', controller.listarProjetos);
router.get('/:codigo/tarefas', controller.listarTarefas);
router.get('/:codigo/resumo', controller.resumoProjeto);
router.get('/:codigo', controller.buscarProjeto);
router.post('/', controller.criarProjeto);
router.put('/:codigo/tarefas/:codigoTarefa', controller.atualizarTarefa);
router.delete('/:codigo/tarefas/:codigoTarefa', controller.excluirTarefa);
router.post('/:codigo/tarefas', controller.criarTarefa);
router.put('/:codigo', controller.atualizarProjeto);
router.delete('/:codigo', controller.excluirProjeto);

module.exports = router;
