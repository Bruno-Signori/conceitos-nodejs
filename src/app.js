const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: 'invalid repository id.'});
  }
  return next();
}
app.use('/repositories/:id', validateRepositoryId);


app.get("/repositories", (request, response) => {
 // const { title, url, techs } = resquest.query;
 // console.log(title);
  // console.log(url);
  // console.log(techs);

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  //console.log(title);
  //console.log(techs);

 repositories.push(repository);

 return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return repositoryIndex.status(400).json({ error: 'repository not found.' })
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes : repositories[repositoryIndex].likes
 };
repositories[repositoryIndex] = repository;
return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return repositoryIndex.status(400).json({ error: 'repository not found.' })
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'repository not found.' });
  }


  repository.likes++ ;

  return response.json(repository);

});

module.exports = app;


//yarn test --watchAll
//f testes que falharam
//o teste que receberam mudanças
//q quit

//GET /repositories: Rota que lista todos os repositórios;