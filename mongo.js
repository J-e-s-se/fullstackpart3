const mongoose = require('mongoose')

const username = "admin"
const password = process.argv[2]


const uri = `mongodb+srv://${username}:${password}@cluster0.tfdc3.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length < 4) {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

else {
  const person_name = process.argv[3]
  const person_number = process.argv[4]
  
  const person = new Person({
    name: person_name,
    number: person_number
  })
  
  person
    .save()
    .then(response => {
      console.log(`added ${person_name} number ${person_number} to phonebook`)
      mongoose.connection.close()
    })
}