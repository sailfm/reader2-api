const Hapi = require('hapi')
const boom = require('boom')
const path = require('path')
const inert = require('inert')
const vision = require('vision')
const api = require('./api')
const logger = require('./plugins/logger')

const server = Hapi.server({
  port: parseInt(process.env.PORT, 10),
  routes: {
    files: { relativeTo: path.join(__dirname, 'public') },
    validate: {
      failAction: async (request, h, error) => {
        if (process.env.NODE_ENV === 'production') {
          request.log('error', error.message)
          throw boom.badRequest(`Invalid request payload input`)
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
  await server.register(inert)
  await server.register(api)
  await server.register(vision)
  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  })
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
