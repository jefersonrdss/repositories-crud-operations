const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

// Lista de respositorios
const repositories = [];


// listar repositorios
app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

// cadastrar repositorio
app.post("/repositories", (request, response) => {

    // dados da requisicao
    const { title, url, techs } = request.body

    // criando objeto que sera cadastrado
    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };

    // adicionando novo repositorio
    repositories.push(repository);
    return response.status(201).json(repository);
});

// atualizar repositorio
app.put("/repositories/:id", (request, response) => {
    
    // dados da requisicao
    const { id } = request.params;
    const updatedRepository = request.body;

    // remover a propriedade likes caso tenha sido passada
    if (updatedRepository.likes){
        delete updatedRepository.likes;
    }

    // verificar se repositorio existe
    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(404).json({ error: "Repository not found" });
    }

    // merge dos objetos (atual e novo para atualizar)
    const repository = { ...repositories[repositoryIndex], ...updatedRepository };

    repositories[repositoryIndex] = repository; // atualizando repositorio na lista

    return response.json(repository);
});

// deletar repositorio
app.delete("/repositories/:id", (request, response) => {

    // dados da requisicao
    const { id } = request.params;

    // verifica se repositorio existe
    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(404).json({ error: "Repository not found" });
    }

    // remove repositorio
    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

// para adicionar likes ao repositorio
app.post("/repositories/:id/like", (request, response) => {

    // dados da requisi????o
    const { id } = request.params;

    // verifica se reposit??rio existe
    repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(404).json({ error: "Repository not found" });
    }

    // incrementando like
    repositories[repositoryIndex].likes++;

    return response.json({ message: "Like add" });
});

module.exports = app;
