# API de Gerenciamento de Projetos e Tarefas

## 1. Objetivo

Aplicação REST para cadastrar, consultar, atualizar e excluir projetos e suas tarefas. Os dados são persistidos no MongoDB Atlas ou em uma instância MongoDB local.

## 2. Tecnologias

- Node.js e Express;
- MongoDB e Mongoose;
- dotenv para configuração por variáveis de ambiente;
- nodemon para desenvolvimento.

## 3. Pré-requisitos

- Node.js e npm instalados;
- acesso a um cluster MongoDB Atlas ou a uma instância local;
- Thunder Client (opcional, para executar as requisições de teste).

## 4. Instalação

No terminal, entre na pasta `projeto-gerenciamento` e instale as dependências:

```sh
npm install
```

## 5. Configuração do MongoDB Atlas

No Atlas, crie ou selecione um cluster, configure um usuário de banco de dados e autorize o IP da máquina em **Network Access / IP Access List**. Em **Connect / Drivers / Node.js**, copie a URI do cluster. O usuário de banco e o usuário de acesso ao Atlas são credenciais diferentes. Não compartilhe a URI nem a senha.

O Mongoose cria o banco `gerenciamento_projetos` e a coleção `projetos` quando a aplicação conecta e grava os dados. Se a coleção não tiver projetos, três projetos iniciais são inseridos automaticamente.

## 6. Variáveis de ambiente

Crie o arquivo `.env` a partir de `.env.example`. Preencha `MONGO_URI` com sua URI privada. Para Atlas, inclua `gerenciamento_projetos` como nome do banco antes dos parâmetros de consulta:

```env
MONGO_URI=mongodb+srv://USUARIO:SENHA@SEU-CLUSTER.mongodb.net/gerenciamento_projetos?retryWrites=true&w=majority
PORT=3000
```

Substitua os valores de exemplo localmente. Se a senha tiver caracteres especiais, codifique-os para uso na URI. O arquivo `.env` é ignorado pelo Git e não deve ser publicado.

## 7. Execução

```sh
npm run dev
```

O servidor aguarda a conexão com o MongoDB e a inicialização do índice único antes de aceitar requisições. A API fica disponível em `http://localhost:3000` por padrão. Para iniciar sem nodemon, use `npm start`.

## 8. Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/projetos` | Lista projetos; aceita filtros `nome` e `tarefa`, que podem ser combinados. |
| GET | `/projetos/:codigo` | Consulta um projeto pelo código. |
| GET | `/projetos/:codigo/tarefas` | Lista as tarefas do projeto. |
| POST | `/projetos` | Cadastra projeto com `codigo` e `nome`. |
| PUT | `/projetos/:codigo` | Atualiza o `nome` do projeto. |
| DELETE | `/projetos/:codigo` | Exclui o projeto e suas tarefas. |
| POST | `/projetos/:codigo/tarefas` | Adiciona tarefa com `codigo`, `nome` e `responsavel`. |
| PUT | `/projetos/:codigo/tarefas/:codigoTarefa` | Atualiza `nome` e `responsavel` da tarefa. |
| DELETE | `/projetos/:codigo/tarefas/:codigoTarefa` | Exclui a tarefa indicada. |
| GET | `/projetos?tarefa=TAR101` | Filtra projetos pelo código de tarefa. |
| GET | `/projetos/:codigo/resumo` | Retorna projeto, quantidade de tarefas e responsáveis únicos. |

O filtro por nome é parcial e não diferencia maiúsculas de minúsculas. Os filtros por nome e tarefa são combináveis, por exemplo: `GET /projetos?nome=Site&tarefa=TAR101`.

## 9. Exemplos

Criar projeto:

```http
POST http://localhost:3000/projetos
Content-Type: application/json
```

```json
{
  "codigo": "PRJ900",
  "nome": "Projeto de teste"
}
```

Resposta de sucesso: **201 Created**, com o documento cadastrado.

Resumo de projeto (`GET /projetos/PRJ001/resumo`):

```json
{
  "codigo": "PRJ001",
  "nome": "Desenvolvimento de Site",
  "totalTarefas": 2,
  "responsaveis": ["Ana", "Carlos"]
}
```

Erro de validação:

```json
{
  "erro": "Código e nome do projeto são obrigatórios"
}
```

## 10. Códigos HTTP

- `200`: consulta ou atualização realizada;
- `201`: cadastro realizado;
- `204`: exclusão realizada sem conteúdo;
- `400`: campos ausentes ou dados inválidos;
- `404`: projeto, tarefa ou rota não encontrada;
- `409`: código de projeto ou tarefa duplicado;
- `500`: erro inesperado do servidor.

## 11. Requisições para Thunder Client

A coleção importável está em `thunder-client/API-Gerenciamento-de-Projetos.postman_collection.json`. No Thunder Client, abra **Collection → Import**, selecione esse arquivo e execute primeiro a pasta **Sucesso** em ordem e depois **Erros**. As requisições usam a API em `localhost`; inicie o servidor antes de executá-las.

As capturas reais devem ser salvas em `evidencias/sucesso` e `evidencias/erros` após cada requisição no Thunder Client.
