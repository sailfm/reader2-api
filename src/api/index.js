const Joi = require('joi')
const read = require('../lib/read')
const Boom = require('boom')
const Duration = require('duration')

module.exports = {
  name: 'ApiPlugin',
  register: async (server, options) => {
    server.route([
      {
        method: 'POST',
        path: '/read',
        handler: async (request, h) => {
          try {
            const start = new Date()
            const { title, content, normalizedUrl } = await read(
              request.payload.url
            )
            return {
              request_time: start.toISOString(),
              duration: new Duration(start).toString(1),
              title,
              content,
              normalizedUrl
            }
          } catch (error) {
            return Boom.badRequest(error.message, { url: request.payload.url })
          }
        },
        options: {
          validate: {
            payload: Joi.object({
              url: Joi.string().required()
            })
          }
        }
      }
    ])
  }
}
