// importa el modulo servidor web integrado de Node.
// Parecido al codigo del lado del navegador: import http from 'http'
// const http = require('http')

const express = require('express')
const app = express()
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

// El código usa el método createServer del módulo http para crear un nuevo servidor web. 
// Se registra un controlador de eventos en el servidor, que se llama cada vez que se realiza una solicitud HTTP 
// a la dirección del servidor http://localhost:3001.
// Se enlaza el servidor http asignado a la variable app
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// Dado que el parámetro es un string, express establece automáticamente el valor del header Content-Type en text/html. 
// El código de estado de la respuesta predeterminado es 200.
// manejador de eventos: raiz
app.get('/', (request, response) => {
  response.send('<h1>Hello World! Esto es un mensaje desde el backend.</h1>')
})

// Express establece automáticamente el header Content-Type con el valor apropiado de application/json.
// manejador de eventos: '/api/notes'
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// para debuggear
// app.get('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   const note = notes.find(note => {
//     console.log(note.id, typeof note.id, id, typeof id, note.id === id)
//     return note.id === id
//   })
//   console.log(note)
//   response.json(note)
// })
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// DELETE
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// POST
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.use(unknownEndpoint)

// El servidor http escucha las solicitudes HTTP enviadas al puerto 3001:
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})