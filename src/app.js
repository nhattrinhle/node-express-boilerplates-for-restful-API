const express = require('express')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const morgan = require('./config/morgan')
const config = require('./config/config')
const { authLimit } = require('./middlewares/rateLimit')

const app = express()

if (config.env !== 'test') {
    app.use(morgan.successHandler)
    app.use(morgan.errorHandler)
}

// set security http headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// prevent mongodb operator injection
app.use(mongoSanitize())

// enable cors
app.use(cors())
app.options('*', cors())

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/v1/auth', authLimit)
}

app.use('/v1', (req, res) => {
    return res.status(200).json('OK')
})

module.exports = app
