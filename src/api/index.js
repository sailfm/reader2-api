const joi = require('joi')
const read = require('../lib/read')

module.exports = {
  name: 'ApiPlugin',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/favicon.ico',
        handler: (request, h) => {
          return h.file('favicon.ico')
        }
      },
      {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
          return h.view('index')
        }
      },
      {
        method: 'GET',
        path: '/{params*}',
        handler: async (request, h) => {
          console.log('params111')
          try {
            const url = request.url.path.substring(1)
            const { title, content } = await read(url)
            return h.view('index', {
              title: `${title} | `,
              unsafebody: content,
              url
            })
          } catch (error) {
            return h.view('index', { unsafebody: `<p>${error.message}</p>` })
          }
        }
      },
      {
        method: 'GET',
        path: '/read',
        handler: async (request, h) => {
          return h.redirect(`/${request.query.url}`)
        },
        options: {
          validate: {
            query: {
              mode: joi
                .string()
                .valid(['read'])
                .required(),
              url: joi.string().required()
            }
          }
        }
      }
    ])
  }
}
