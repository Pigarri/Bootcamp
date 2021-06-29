//Chamando a pasta express
const express  = require('express');
//uuid cria um id unico
const {uuid, isUuid} = require('uuidv4');

const cors  = require('cors');

const app = express();
//serve para ler o json como variavel
app.use(cors()); 
app.use(express.json());


/*
// MOTODOS http

   GET =  Busca informações do back-end
   POST =  Criar uma informação no back-end
   PUT / PATCH = Alterar uma informação no back-end
   DELETE = Deletar uma informação no back-end
*/

//1) hello world
/*app.get('/projects', (request, response) => {
  //return response.send('Hello World');
  //commd: yarn 
  return response.json({ message: 'Hello World Json'});
});*/

/*
  TIPOS DE PARAMETROS

  Query Params: filtros e paginação
  Route Params: Identificar  recursos (Atualizar/Deletar)
  Request Body: Conteudo na hora de criar ou editar o recurso
*/

/* MIDDLEWARE
  Interceptador de requisições ( ele pode interromper totalmente uma reuqisição ou alterar dados da requisição)
*/

//variavel global
const projects = [];

function logRequests(request, response,next) { //MIDDLEWARE
  const { method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  //console.log(logLabel);

  console.time(logLabel);
  //return next(); //chama a proxima app ou middleware, que é app.get
  next();
  console.timeEnd(logLabel);
}

function validateProjectId(request,response,next){
  const {id} = request.params;

  if (!isUuid(id) ){
    return response.status(400).json({ error: 'Invalid project ID'});
  }
  return next();
}

app.use(logRequests);
app.use('/project/:id',validateProjectId);

// ********************************************************  GET
app.get('/projects',logRequests,(request,response) =>{

  //Query Params
  //const query = request.query;
  //console.log(query); 
  const {title, owner} = request.query;
  const results = title ? projects.filter(project => project.title.includes(title)) : projects;

  //const {title,owner,base} = request.query;
  //console.log(title); 
  //console.log(owner); 
  //console.log(base);   

  return response.json(results);
});

// ********************************************************  POST
app.post('/projects', (request,response) =>{

  const {title, owner} = request.body;
  console.log(title);
  console.log(owner);

  const project = { id:uuid(), title, owner};
  projects.push(project); 


  //return response.json(project);
  return response.json(projects);
});

// ********************************************************  PUT
app.put('/projects/:id', validateProjectId,(request,response) =>{

  const {id} = request.params;
  const {title, owner} = request.body;
  console.log(id);

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0){
    return response.status(400).json({ error: 'Project not found!'});
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

// ********************************************************  DELETE
app.delete('/projects/:id', (request,response) =>{
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0){
    return response.status(400).json({ error: 'Project not found!'});
  }

  //excluir pelo id 
  projects.splice(projectIndex,1);
   
  return response.status(204).send();
});

//colocar a porta do LOCALHOST
app.listen(3333, () =>{
  console.log('🤦‍♂️ Back-end started ✔🔥');
});
