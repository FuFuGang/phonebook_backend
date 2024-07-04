const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
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
const generateId = ()=>{
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));
app.get('/api/persons', (request, response) => {
    response.json(persons);

});
app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === Number(request.params.id));
    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
});
app.delete('/api/persons/:id', (request, response) => {
    const personIndex = persons.findIndex(p => p.id === Number(request.params.id));
    persons.splice(personIndex, 1);
    response.status(204).end();
});
app.get('/info', (request, response) => {
    let date = new Date();
    let formattedDate = date.toLocaleDateString();
    response.send(`<h1>Phonebook has info for 2 people</h1><p> ${formattedDate} </p>`);
});
app.post('/api/persons', (request, response) => {
    const body = request.body;
    body.id = generateId();
    if (!body.name || !body.number) {
        response.status(400).json({error: 'Name or number missing'});
    }
    else if (persons.find(p => p.name === body.name)) {
        response.status(400).json({error: 'Name must be unique'});
    }
    persons = persons.concat(body);
    response.status(201).send(persons);
    
    
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
