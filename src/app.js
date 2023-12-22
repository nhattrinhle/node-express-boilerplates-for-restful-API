const express = require('express')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss')
const helmet = require('helmet')
const morgan = require('./config/morgan')
const config = require('./config/config')

const app = express()

// set security http headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// prevent xss attacks
app.use(xss)

// prevent mongodb operator injection
app.use(mongoSanitize())

// enable cors
app.use(cors())
app.options('*', cors())

if (config.env !== 'test') {
    app.use(morgan.successHandler)
    app.use(morgan.errorHandler)
}

module.exports = app
