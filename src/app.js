const express = require('express')
const config = require('./config/config')
const morgan = require('./config/morgan')

const app = express()

if (config.env !== 'test') {
    app.use(morgan.successHandler)
    app.use(morgan.errorHandler)
}

module.exports = app
