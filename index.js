const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('custom_data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan('tiny', {
  skip: (req, res) => {return req.method === 'POST'}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom_data', {
  skip: (req, res) => {return req.method !== 'POST'}
}))

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  person ? response.json(person) : response.status(404).end()
})

app.post("/api/persons", (request, response) => {
  const person = request.body
  const name_exists = persons.some(p => p.name === person.name)

  if(!person.name) {
    return response.status(400).json({error: "name missing"})
  }
  if (!person.number) {
    return response.status(400).json({error: "number missing"})
  }
  if (name_exists) {
    return response.status(400).json({error: "name must be unique"})
  }

  const id = Math.floor(Math.random() * 1000000)
  person.id = id
  persons = persons.concat(person)
  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.get("/info", (request, response) => {
  const date = new Date()
  response.send(
    `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date.toUTCString()}</p>
    `
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})