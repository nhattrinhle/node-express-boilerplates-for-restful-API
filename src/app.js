const express = require('express')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const httpStatus = require('http-status')
const morgan = require('./config/morgan')
const config = require('./config/config')
const { authLimit } = require('./middlewares/rateLimit')
const ApiError = require('./utils/apiError')
const routes = require('./routes/v1')
const { errorConverter, errorHandler } = require('./middlewares/error')

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

app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

module.exports = app
