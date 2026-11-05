const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  nome: { type: String, required: true, trim: true },
  responsavel: { type: String, required: true, trim: true }
}, { _id: false });

const projetoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, trim: true },
  nome: { type: String, required: true, trim: true },
  tarefas: {
    type: [tarefaSchema],
    default: [],
    validate: {
      validator(tarefas) {
        const codigos = tarefas.map((tarefa) => tarefa.codigo);
        return new Set(codigos).size === codigos.length;
      },
      message: 'Os códigos das tarefas devem ser únicos dentro do projeto'
    }
  }
}, { timestamps: true, collection: 'projetos' });

module.exports = mongoose.model('Projeto', projetoSchema);
