require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 9090

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.Promise = global.Promise

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to mongodb.')
  })
  .then(e => console.error(e))

app.use('/', require('./routes/todos'))
app.listen(port, () => console.log(`Server listening on port ${port}`))
