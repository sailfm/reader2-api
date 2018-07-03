const Hapi = require('hapi')
const Boom = require('boom')
const logger = require('./plugins/logger')
const api = require('./api')
const path = require('path')

const server = Hapi.server({
  port: parseInt(process.env.PORT, 10),
  routes: {
    cors: {
      origin: ['http://localhost:3200', 'http://dawoodjee.com']
    },
    validate: {
      failAction: async (request, h, error) => {
        if (process.env.NODE_ENV === 'production') {
          request.log('error', error.message)
          throw Boom.badRequest(`Invalid request payload input`)
        } else {
          request.log('error', error.message)
          throw error
        }
      }
    }
  }
})

const init = async () => {
  await server.register(logger)
  await server.register(api)
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
